<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Traits\CrudOperations;
use App\Traits\GeneratesMatricule;
use App\Models\Etudiant;
use App\Models\Group;
use App\Models\User;
use App\Models\Professeur;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class EtudiantController extends Controller
{
    use CrudOperations, GeneratesMatricule;

    protected string $model = Etudiant::class;

    protected array $validationRules = [
        // User validation rules
        'EmailET' => 'nullable|email|max:255',
        'PhoneET' => 'nullable|string|max:20',
        'ProfileFileNamePL' => 'nullable|string|max:255',

        // Etudiant validation rules
        'LienParenteTR' => 'nullable|string|max:255',
        'ProfessionTR' => 'nullable|string|max:255',
        'NomTR' => 'nullable|string|max:255',
        'PrenomTR' => 'nullable|string|max:255',
        'Phone1TR' => 'nullable|string|max:20',
        'Phone2TR' => 'nullable|string|max:20',
        'EmailTR' => 'nullable|email|max:255',
        'ObservationTR' => 'nullable|string|max:255',
        'MatriculeGP' => 'nullable|string|exists:groups,MatriculeGP',
        'MatriculeNV' => 'required|string|exists:niveaux,MatriculeNV',
        'MatriculeYR' => 'required|string|exists:academic_years,MatriculeYR',

        // Person data
        'NomPL' => 'required|string|max:255',
        'PrenomPL' => 'required|string|max:255',
        'GenrePL' => 'nullable|string|max:255|in:Homme,Femelle',
        'AdressPL' => 'nullable|string|max:255',
        'VillePL' => 'nullable|string|max:255',
        'CodePostalPL' => 'nullable|string|max:10',
        'PaysPL' => 'nullable|string|max:255',
        'NationalitePL' => 'nullable|string|max:255',
        'LieuNaissancePL' => 'nullable|string|max:255',
        'DateNaissancePL' => 'nullable|date',
        'ObservationPL' => 'nullable|string|max:255',
    ];

    protected static function getMatriculePrefix()
    {
        return 'ET';
    }

    public function store(Request $request): \Illuminate\Http\JsonResponse
    {
        try {
            DB::beginTransaction();            

            $validatedData = $this->validateRequest($request, $this->validationRules);
            $username = $validatedData["PrenomPL"] && $validatedData["NomPL"] ? $validatedData["PrenomPL"]." ".$validatedData["NomPL"] : null;
            $password = Str::random(8);
            $validationCode = Str::random(8);
            $user = new User([
                'UserNameUT' => $username,
                'EmailUT' => $validatedData['EmailET'],
                'PhoneUT' => $validatedData['PhoneET'] ?? null,
                'PasswordUT' => Hash::make($password),
                'RoleUT' => "etudiant",
                'ProfileFileNamePL' => $validatedData['ProfileFileNamePL'] ?? null,
                'NomPL' => $validatedData['NomPL'],
                'PrenomPL' => $validatedData['PrenomPL'],
                'GenrePL' => $validatedData['GenrePL'] ?? null,
                'AdressPL' => $validatedData['AdressPL'] ?? null,
                'VillePL' => $validatedData['VillePL'] ?? null,
                'CodePostalPL' => $validatedData['CodePostalPL'] ?? null,
                'PaysPL' => $validatedData['PaysPL'] ?? null,
                'NationalitePL' => $validatedData['NationalitePL'] ?? null,
                'LieuNaissancePL' => $validatedData['LieuNaissancePL'] ?? null,
                'DateNaissancePL' => $validatedData['DateNaissancePL'] ?? null,
                'ObservationPL' => $validatedData['ObservationPL'] ?? null,
                'StatutUT' => 'offline',
                'CodeVerificationUT' => Crypt::encryptString($validationCode),
            ]);
            $user->save();

            $etudiant = new Etudiant([
                'LienParenteTR' => $validatedData['LienParenteTR'] ?? null,
                'ProfessionTR' => $validatedData['ProfessionTR'] ?? null,
                'NomTR' => $validatedData['NomTR'] ?? null,
                'PrenomTR' => $validatedData['PrenomTR'] ?? null,
                'Phone1TR' => $validatedData['Phone1TR'] ?? null,
                'Phone2TR' => $validatedData['Phone2TR'] ?? null,
                'EmailTR' => $validatedData['EmailTR'] ?? null,
                'ObservationTR' => $validatedData['ObservationTR'] ?? null,
                'MatriculeUT' => $user->MatriculeUT,
                'MatriculeGP' => $validatedData['MatriculeGP'] ?? null,
                'MatriculeNV' => $validatedData['MatriculeNV'] ?? null,
                'MatriculeYR' => $validatedData['MatriculeYR'],
            ]);
            $etudiant->save();
            DB::commit();
            $etudiant->load('user');

            $result = [
                "etudiant" => $etudiant,
                "userInfo" => [
                    "username" => $username,
                    "password" => $password,
                    "validationCode" => $validationCode,
                    'EmailUT' => $validatedData['EmailET'] ?? null,
                    'PhoneUT' => $validatedData['PhoneET'] ?? null,
                ]
            ];

            return $this->successResponse($result, 'created');

        } catch (\Illuminate\Validation\ValidationException $e) {
			DB::rollBack();
			return response()->json([
				'message' => 'Validation error',
				'errors' => $e->errors(),
			], 400);
		} catch (\Exception $e) {
			DB::rollBack();
			Log::error($e->getMessage());
			return $this->errorResponse($e->getMessage(), 500);
		}

    }
public function update(Request $request, $matricule): \Illuminate\Http\JsonResponse
{
    try {
        DB::beginTransaction();

        // استرجاع الطالب والمستخدم المرتبط
        $etudiant = Etudiant::where('MatriculeET', $matricule)->first();
        if (!$etudiant) return $this->notFoundResponse($this->getResourceName());

        $user = User::where('MatriculeUT', $etudiant->MatriculeUT)->first();
        if (!$user) return $this->notFoundResponse('User');

        // تعديل قواعد التحقق لتجاهل البريد الحالي
        $rules = $this->validationRules;
        $rules['EmailET'] = 'required|email|max:255|unique:users,EmailUT,' . $user->MatriculeUT . ',MatriculeUT';

        $validatedData = $this->validateRequest($request, $rules);


        // تحديث بيانات المستخدم
        $user->update([
            'EmailUT' => $validatedData['EmailET'],
            'PhoneUT' => $validatedData['PhoneET'] ?? null,
            'ProfileFileNamePL' => $validatedData['ProfileFileNamePL'] ?? null,
            'NomPL' => $validatedData['NomPL'],
            'PrenomPL' => $validatedData['PrenomPL'],
            'GenrePL' => $validatedData['GenrePL'] ?? null,
            'AdressPL' => $validatedData['AdressPL'] ?? null,
            'VillePL' => $validatedData['VillePL'] ?? null,
            'CodePostalPL' => $validatedData['CodePostalPL'] ?? null,
            'PaysPL' => $validatedData['PaysPL'] ?? null,
            'NationalitePL' => $validatedData['NationalitePL'] ?? null,
            'LieuNaissancePL' => $validatedData['LieuNaissancePL'] ?? null,
            'DateNaissancePL' => $validatedData['DateNaissancePL'] ?? null,
            'ObservationPL' => $validatedData['ObservationPL'] ?? null,
            'StatutUT' => 'offline',
        ]);

        // تحديث بيانات الطالب
        $etudiant->update([
            'LienParenteTR' => $validatedData['LienParenteTR'] ?? null,
            'ProfessionTR' => $validatedData['ProfessionTR'] ?? null,
            'NomTR' => $validatedData['NomTR'] ?? null,
            'PrenomTR' => $validatedData['PrenomTR'] ?? null,
            'Phone1TR' => $validatedData['Phone1TR'] ?? null,
            'Phone2TR' => $validatedData['Phone2TR'] ?? null,
            'EmailTR' => $validatedData['EmailTR'] ?? null,
            'ObservationTR' => $validatedData['ObservationTR'] ?? null,
            'MatriculeGP' => $validatedData['MatriculeGP'] ?? null,
            'MatriculeNV' => $validatedData['MatriculeNV'] ?? null,
            'MatriculeYR' => $validatedData['MatriculeYR'],
        ]);

        DB::commit();
        $etudiant->load('user');

        return $this->successResponse($etudiant, 'updated');

    } catch (\Illuminate\Validation\ValidationException $e) {
        DB::rollBack();
		Log::error($e->errors());
        return response()->json([
            'message' => 'Validation error',
            'errors' => $e->errors(),
        ], 400);
    } catch (\Exception $e) {
        DB::rollBack();
        return $this->handleException($e);
    }
}

    public function destroy($matricule): \Illuminate\Http\JsonResponse
    {
        try {
            DB::beginTransaction();

            $etudiant = Etudiant::where('MatriculeET', $matricule)->first();
            if (!$etudiant) return $this->notFoundResponse($this->getResourceName());

            $user = User::where('MatriculeUT', $etudiant->MatriculeUT)->first();
            if ($user) $user->delete();

            $etudiant->delete();

            DB::commit();
            return $this->successResponse(null, 'deleted');

        } catch (\Exception $e) {
            DB::rollBack();
            return $this->handleException($e);
        }
    }

public function index(): \Illuminate\Http\JsonResponse
{
    try {
        $records = $this->model::with([
            'user',
            'group',
            'attendances',
            'notes',
            'noteFinals',
            'evaluationResults',
            'evaluationResults.evaluation',
            'group.niveau',
        ])->get();

        $allStudentAverages = [];
        $groupStudentAverages = [];

        // Collect averages
        foreach ($records as $student) {
            $matricule = $student->MatriculeET;
            $groupMatricule = $student->MatriculeGP;

            $avgGrade = $this->calculateAverageGrades($student->notes, $student->noteFinals);

            $allStudentAverages[$matricule] = $avgGrade;
            $groupStudentAverages[$groupMatricule][$matricule] = $avgGrade;
        }

        // Sort averages in descending order
        arsort($allStudentAverages);
        foreach ($groupStudentAverages as &$g) arsort($g);

        $enhancedRecords = $records->map(function ($student) use ($allStudentAverages, $groupStudentAverages) {
            $studentData = $student->toArray();
            $matricule = $student->MatriculeET;
            $groupMatricule = $student->MatriculeGP;

            // Attendance statistics
            $studentData['attendanceStats'] = $this->calculateAttendanceStats($student->attendances);

            // Grade statistics
            $gradeStats = $this->calculateGradeStats($student->notes, $student->noteFinals) ?? [];

            // Add group statistics
            if ($groupMatricule && isset($groupStudentAverages[$groupMatricule])) {
                $groupStats = $this->calculateMinMaxStats($groupStudentAverages[$groupMatricule]);
                $gradeStats['groupHighest'] = $groupStats['highest'];
                $gradeStats['groupLowest'] = $groupStats['lowest'];
            }

            $studentData['gradeStats'] = $gradeStats;

            // Rankings within institution and group
            $studentData['ranking'] = [
                'institution' => array_search($matricule, array_keys($allStudentAverages)) + 1,
                'institutionTotal' => count($allStudentAverages),
                'institutionPercentile' => round(100 - ((array_search($matricule, array_keys($allStudentAverages)) + 1) / count($allStudentAverages) * 100), 1),
            ];

            if ($groupMatricule && isset($groupStudentAverages[$groupMatricule])) {
                $studentData['ranking']['group'] = array_search($matricule, array_keys($groupStudentAverages[$groupMatricule])) + 1;
                $studentData['ranking']['groupTotal'] = count($groupStudentAverages[$groupMatricule]);
                $studentData['ranking']['groupPercentile'] = round(100 - (($studentData['ranking']['group'] / $studentData['ranking']['groupTotal']) * 100), 1);
            }

            // Niveau name (direct name only)
            $studentData['niveauName'] = $student->niveau ? $student->niveau->NomNV : null;

            return $studentData;
        });

        return $this->successResponse([
            'data' => $enhancedRecords,
            'total' => $records->count()
        ]);
    } catch (\Exception $e) {
        Log::error($e->getMessage());
        return $this->handleException($e);
    }
}
    private function calculateAverageGrades($notes, $noteFinals) {
        $averageGrade = 0;

        $grades = $notes->pluck('GradeNT')->filter()->map(fn($g) => (float)$g)->toArray();

        if (count($grades) > 0) {
            $averageGrade = array_sum($grades) / count($grades);
        }

        if ($noteFinals->isNotEmpty()) {
            $finalGrade = (float)$noteFinals[0]->GradeNF;
            if ($finalGrade > 0) {
                $averageGrade = $finalGrade;
            }
        }

        return $averageGrade;
    }

    private function calculateAttendanceStats($attendances) {
        $total = $attendances->count();
        if ($total === 0) {
            return null;
        }

        $counts = [
            'Present' => $attendances->where('StatusAT', 'Present')->count(),
            'Absent' => $attendances->where('StatusAT', 'Absent')->count(),
            'Late' => $attendances->where('StatusAT', 'Late')->count(),
            'Excused' => $attendances->where('StatusAT', 'Excused')->count(),
        ];

        return [
            'total' => $total,
            'presentPercentage' => round(($counts['Present'] / $total) * 100, 2),
            'absentPercentage' => round(($counts['Absent'] / $total) * 100, 2),
            'latePercentage' => round(($counts['Late'] / $total) * 100, 2),
            'excusedPercentage' => round(($counts['Excused'] / $total) * 100, 2),
            'presentCount' => $counts['Present'],
            'absentCount' => $counts['Absent'],
            'lateCount' => $counts['Late'],
            'excusedCount' => $counts['Excused'],
        ];
    }

    private function calculateGradeStats($notes, $noteFinals) {
        if ($notes->isEmpty()) {
            return null;
        }

        $grades = $notes->pluck('GradeNT')->filter()->map(fn($g) => (float)$g)->toArray();
        $averageGrade = array_sum($grades) / count($grades);
        $highestGrade = max($grades);
        $lowestGrade = min($grades);

        $chronologicalNotes = $notes->sortBy('created_at');
        $firstNote = $chronologicalNotes->first();
        $lastNote = $chronologicalNotes->last();

        $gradeStats = [
            'average' => round($averageGrade, 2),
            'highest' => $highestGrade,
            'lowest' => $lowestGrade,
            'firstNote' => $firstNote ? (float) $firstNote->GradeNT : null,
            'lastNote' => $lastNote ? (float) $lastNote->GradeNT : null,
            'firstNoteDate' => $firstNote ? $firstNote->created_at : null,
            'lastNoteDate' => $lastNote ? $lastNote->created_at : null,
        ];

        // Final grade & status
        if ($noteFinals->isNotEmpty()) {
            $finalGrade = (float)$noteFinals[0]->GradeNF;
            $gradeStats['final'] = $finalGrade;
            $gradeStats['status'] = match (true) {
                $finalGrade >= 16 => 'excellent',
                $finalGrade >= 14 => 'veryGood',
                $finalGrade >= 12 => 'good',
                $finalGrade >= 10 => 'satisfactory',
                $finalGrade >= 8  => 'needsImprovement',
                default => 'poor',
            };
        }

        return $gradeStats;
    }

    private function calculateMinMaxStats(array $averages): array
    {
        if (empty($averages)) {
            return ['highest' => 0, 'lowest' => 0];
        }
        return [
            'highest' => round(max($averages), 2),
            'lowest' => round(min($averages), 2),
        ];
    }

    private function getNiveauName($niveau): ?string
{
    return $niveau ? $niveau->NomNV : null;
}
public function show($matricule)
{
    // جلب الأستاذ من خلال الـmatricule (وهو user_id هنا)
    $professeur = Professeur::where('MatriculeUT', $matricule)->first();

    if (!$professeur) {
        return response()->json(['error' => 'Professeur non trouvé'], 404);
    }

    // جلب كل الطلاب المرتبطين عبر المجموعات
    $etudiants = $professeur->groups()
        ->with('etudiants.user') // eager loading
        ->get()
        ->pluck('etudiants') // نحصل على مجموعات الطلاب
        ->flatten() // تحويلها إلى قائمة واحدة
        ->unique('MaticuleET') // حذف التكرار إن وجد
        ->values(); // إعادة ترتيب الفهارس

    return response()->json($etudiants);
}

public function getEtudiantsSelect($MatriculeGP = null)
{
    try {
        // Fetch students with no MatriculeGP
        $unassignedEtudiants = Etudiant::with('user')
            ->whereNull('MatriculeGP')
            ->get()
            ->map(function ($etudiant) {
                return [
                    'MatriculeET' => $etudiant->MatriculeET,
                    'FullNameET' => $etudiant->user ? "{$etudiant->user->PrenomPL} {$etudiant->user->NomPL}" : 'Unknown',
                ];
            });

        // Fetch students with the provided MatriculeGP
        $selectedEtudiants = $MatriculeGP
            ? Etudiant::with('user')
                ->where('MatriculeGP', $MatriculeGP)
                ->get()
                ->map(function ($etudiant) {
                    return [
                        'MatriculeET' => $etudiant->MatriculeET,
                        'FullNameET' => $etudiant->user ? "{$etudiant->user->PrenomPL} {$etudiant->user->NomPL}" : 'Unknown',
                    ];
                })
            : collect([]);

        // Combine both collections, ensuring they are Collections
        $etudiants = collect($unassignedEtudiants)->merge(collect($selectedEtudiants));

        return [
            'etudiants' => $etudiants,
            'selectedET' => $selectedEtudiants,
        ];
    } catch (\Exception $e) {
        return response()->json(['error' => 'An error occurred while fetching students'], 500);
    }
}
public function getAllEmailPhoneUserNameArray()
{
    $etudiants = Etudiant::with('user')->get();

    return [
        "noms" => $etudiants->pluck("user.NomPL")->filter()->values(),
        "prenoms" => $etudiants->pluck("user.PrenomPL")->filter()->values(),
        "emails" => $etudiants->pluck("user.EmailUT")->filter()->values(),
        "phones" => $etudiants->pluck("user.PhoneUT")->filter()->values(),
    ];
}

    public function getFormInformation($selectedCountry = null, $MatriculeNV = null)
    {
    try {
        //get all etudiant with foreach user
        $etudiants = Etudiant::with('user')->get();
        //prepare query for get groups by niveaux
        $query = Group::withCount('etudiants','professeurs');
        if ($MatriculeNV) {
            $query->where('MatriculeNV', $MatriculeNV);
        }

        $groups = $query->get();
        //get all niveaux
        $niveaux = DB::table('niveaux')->select('MatriculeNV', 'NomNV')->get();
        // If a specific country is selected, filter the etudiants by that country
        $villes = [];
        if ($selectedCountry) {
            $response = Http::get("http://localhost:3000/ville/{$selectedCountry}");
            if ($response->successful()) {
                $villes = $response->json(); // تحويل إلى array
            }
        }
        
    return [
        "EmailsPhonesData" => [
            "noms" => $etudiants->pluck("user.NomPL")->filter()->values(),
            "prenoms" => $etudiants->pluck("user.PrenomPL")->filter()->values(),
            "emails" => $etudiants->pluck("user.EmailUT")->filter()->values(),
            "phones" => $etudiants->pluck("user.PhoneUT")->filter()->values()
        ],
        "groups" => $groups,
        "niveaux" => $niveaux,
        "villes" => $villes
    ];
    } catch (\Exception $e) {
        Log::error($e->getMessage());
        return $this->handleException($e);
    }

    }

}
