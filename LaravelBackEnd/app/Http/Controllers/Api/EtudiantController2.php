<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Traits\CrudOperations;
use App\Traits\GeneratesMatricule;
use App\Models\Etudiant;
use App\Models\Group;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class EtudiantController2 extends Controller
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
    public function show($matricule): \Illuminate\Http\JsonResponse
    {
        try {
            $etudiant = $this->model::with([
                'user',
                'group',
                'attendances',
                'notes',
                'noteFinals',
                'evaluationResults',
                'evaluationResults.evaluation',
                'group.niveau',
                'group.niveau.parent',
                'group.niveau.children'
            ])->where('MatriculeET', $matricule)->firstOrFail();

            // Get all students data for ranking calculation
            $allStudents = $this->model::with(['notes', 'noteFinals', 'group.niveau'])->get();

            // Get all average grades for ranking calculation
            $allStudentAverages = [];
            $groupStudentAverages = [];
            $niveauStudentAverages = []; // New array for niveau-based ranking

            $groupMatricule = $etudiant->MatriculeGP;
            $niveauMatricule = $etudiant->group->MatriculeNV ?? null;

            // First pass to calculate all averages
            foreach ($allStudents as $student) {
                $studentMatricule = $student->MatriculeET;
                $studentGroupMatricule = $student->MatriculeGP;
                $studentNiveauMatricule = $student->group->MatriculeNV ?? null;

                // Calculate average grade
                $averageGrade = 0;
                if (count($student->notes) > 0) {
                    $grades = $student->notes->pluck('GradeNT')->filter()->map(function($grade) {
                        return (float)$grade;
                    })->toArray();

                    if (count($grades) > 0) {
                        $averageGrade = array_sum($grades) / count($grades);
                    }
                }

                // If student has final grades, use the final grade instead
                if (count($student->noteFinals) > 0) {
                    $finalGrade = (float)$student->noteFinals[0]->GradeNF;
                    if ($finalGrade > 0) {
                        $averageGrade = $finalGrade;
                    }
                }

                // Store for ranking
                $allStudentAverages[$studentMatricule] = $averageGrade;

                // If this student is in the same group as our requested student
                if ($studentGroupMatricule === $groupMatricule) {
                    if (!isset($groupStudentAverages[$studentGroupMatricule])) {
                        $groupStudentAverages[$studentGroupMatricule] = [];
                    }
                    $groupStudentAverages[$studentGroupMatricule][$studentMatricule] = $averageGrade;
                }

                // If this student is in the same niveau as our requested student
                if ($studentNiveauMatricule && $studentNiveauMatricule === $niveauMatricule) {
                    if (!isset($niveauStudentAverages[$studentNiveauMatricule])) {
                        $niveauStudentAverages[$studentNiveauMatricule] = [];
                    }
                    $niveauStudentAverages[$studentNiveauMatricule][$studentMatricule] = $averageGrade;
                }
            }

            // Sort all averages in descending order
            arsort($allStudentAverages);

            // Sort group averages
            foreach ($groupStudentAverages as &$groupAverages) {
                arsort($groupAverages);
            }

            // Sort niveau averages
            foreach ($niveauStudentAverages as &$niveauAverages) {
                arsort($niveauAverages);
            }

            // Transform the data to include flattened key relationships for easier frontend access
            $studentData = $etudiant->toArray();

            // Calculate attendance statistics if available
            if (count($etudiant->attendances) > 0) {
                $totalAttendances = count($etudiant->attendances);
                $presentCount = $etudiant->attendances->where('StatusAT', 'Present')->count();
                $absentCount = $etudiant->attendances->where('StatusAT', 'Absent')->count();
                $lateCount = $etudiant->attendances->where('StatusAT', 'Late')->count();
                $excusedCount = $etudiant->attendances->where('StatusAT', 'Excused')->count();

                $studentData['attendanceStats'] = [
                    'total' => $totalAttendances,
                    'presentPercentage' => $totalAttendances > 0 ? round(($presentCount / $totalAttendances) * 100, 2) : 0,
                    'absentPercentage' => $totalAttendances > 0 ? round(($absentCount / $totalAttendances) * 100, 2) : 0,
                    'latePercentage' => $totalAttendances > 0 ? round(($lateCount / $totalAttendances) * 100, 2) : 0,
                    'excusedPercentage' => $totalAttendances > 0 ? round(($excusedCount / $totalAttendances) * 100, 2) : 0,
                    'presentCount' => $presentCount,
                    'absentCount' => $absentCount,
                    'lateCount' => $lateCount,
                    'excusedCount' => $excusedCount,
                ];
            }

            // Calculate grade statistics if available
            if (count($etudiant->notes) > 0) {
                $grades = $etudiant->notes->pluck('GradeNT')->filter()->map(function($grade) {
                    return (float)$grade;
                })->toArray();

                if (count($grades) > 0) {
                    $averageGrade = array_sum($grades) / count($grades);
                    $highestGrade = max($grades);
                    $lowestGrade = min($grades);

                    $studentData['gradeStats'] = [
                        'average' => round($averageGrade, 2),
                        'highest' => $highestGrade,
                        'lowest' => $lowestGrade,
                    ];

                    // Get first and last grades chronologically
                    $chronologicalNotes = $etudiant->notes->sortBy('created_at');
                    if ($chronologicalNotes->count() > 0) {
                        // Get actual first note (earliest date)
                        $firstNote = $chronologicalNotes->first();
                        $studentData['gradeStats']['firstNote'] = $firstNote ? (float) $firstNote->GradeNT : null;

                        // Get actual last note (latest date)
                        $lastNote = $chronologicalNotes->last();
                        $studentData['gradeStats']['lastNote'] = $lastNote ? (float) $lastNote->GradeNT : null;

                        // Get date for first and last notes for reference
                        $studentData['gradeStats']['firstNoteDate'] = $firstNote ? $firstNote->created_at : null;
                        $studentData['gradeStats']['lastNoteDate'] = $lastNote ? $lastNote->created_at : null;
                    }
                }
            }

            // Calculate group statistics (min/max grades)
            if ($groupMatricule && isset($groupStudentAverages[$groupMatricule]) && count($groupStudentAverages[$groupMatricule]) > 0) {
                if (!isset($studentData['gradeStats'])) {
                    $studentData['gradeStats'] = [];
                }

                try {
                    $studentData['gradeStats']['groupHighest'] = round(max($groupStudentAverages[$groupMatricule]), 2);
                    $studentData['gradeStats']['groupLowest'] = round(min($groupStudentAverages[$groupMatricule]), 2);
                } catch (\Exception $e) {
                    // Handle cases where min/max might fail
                    $studentData['gradeStats']['groupHighest'] = 0;
                    $studentData['gradeStats']['groupLowest'] = 0;
                }
            }

            // Calculate level statistics (min/max grades)
            if ($niveauMatricule && isset($niveauStudentAverages[$niveauMatricule]) && count($niveauStudentAverages[$niveauMatricule]) > 0) {
                if (!isset($studentData['gradeStats'])) {
                    $studentData['gradeStats'] = [];
                }

                try {
                    $studentData['gradeStats']['levelHighest'] = round(max($niveauStudentAverages[$niveauMatricule]), 2);
                    $studentData['gradeStats']['levelLowest'] = round(min($niveauStudentAverages[$niveauMatricule]), 2);
                } catch (\Exception $e) {
                    // Handle cases where min/max might fail
                    $studentData['gradeStats']['levelHighest'] = 0;
                    $studentData['gradeStats']['levelLowest'] = 0;
                }
            }

            // If student has final grades, add them to grade stats
            if (count($etudiant->noteFinals) > 0) {
                if (!isset($studentData['gradeStats'])) {
                    $studentData['gradeStats'] = [];
                }
                $finalGrade = (float)$etudiant->noteFinals[0]->GradeNF;
                $studentData['gradeStats']['final'] = $finalGrade;

                // Determine status based on final grade
                if ($finalGrade >= 16) {
                    $studentData['gradeStats']['status'] = 'excellent';
                } elseif ($finalGrade >= 14) {
                    $studentData['gradeStats']['status'] = 'veryGood';
                } elseif ($finalGrade >= 12) {
                    $studentData['gradeStats']['status'] = 'good';
                } elseif ($finalGrade >= 10) {
                    $studentData['gradeStats']['status'] = 'satisfactory';
                } elseif ($finalGrade >= 8) {
                    $studentData['gradeStats']['status'] = 'needsImprovement';
                } else {
                    $studentData['gradeStats']['status'] = 'poor';
                }
            }

            // Add ranking information
            $studentData['ranking'] = [
                'institution' => array_search($matricule, array_keys($allStudentAverages)) + 1,
                'institutionTotal' => count($allStudentAverages),
                'institutionPercentile' => round(100 - ((array_search($matricule, array_keys($allStudentAverages)) + 1) / count($allStudentAverages) * 100), 1),
            ];

            // Add niveau ranking if student belongs to a niveau
            if ($niveauMatricule && isset($niveauStudentAverages[$niveauMatricule])) {
                $studentData['ranking']['niveau'] = array_search($matricule, array_keys($niveauStudentAverages[$niveauMatricule])) + 1;
                $studentData['ranking']['niveauTotal'] = count($niveauStudentAverages[$niveauMatricule]);
                // Calculate percentile within niveau (higher is better)
                $studentData['ranking']['niveauPercentile'] = round(100 - (($studentData['ranking']['niveau'] / $studentData['ranking']['niveauTotal']) * 100), 1);
            }

            // Add group ranking if student belongs to a group
            if (isset($groupStudentAverages[$groupMatricule])) {
                $studentData['ranking']['group'] = array_search($matricule, array_keys($groupStudentAverages[$groupMatricule])) + 1;
                $studentData['ranking']['groupTotal'] = count($groupStudentAverages[$groupMatricule]);
                // Calculate percentile within group (higher is better)
                $studentData['ranking']['groupPercentile'] = round(100 - (($studentData['ranking']['group'] / $studentData['ranking']['groupTotal']) * 100), 1);
            }

            // Add group information
            if ($etudiant->group) {
                $studentData['groupName'] = $etudiant->group->NameGP;

                // Get niveau information
                $niveau = $etudiant->group->niveau;
                if ($niveau) {
                    $niveauName = $niveau->NomNV;

                    // If this niveau has a parent (it's a sub-niveau)
                    if ($niveau->SubMatriculeNV) {
                        $parentNiveau = $niveau->parent;
                        if ($parentNiveau) {
                            $niveauName = $parentNiveau->NomNV . " (" . $niveauName . ")";
                        }
                    }
                    // If this niveau has children (it's a parent niveau)
                    elseif ($niveau->children && $niveau->children->count() > 0) {
                        // We keep just the parent niveau name as is
                    }

                    $studentData['niveauName'] = $niveauName;
                    $studentData['niveauMatricule'] = $niveauMatricule;
                } else {
                    $studentData['niveauName'] = null;
                    $studentData['niveauMatricule'] = null;
                }
            }

            return $this->successResponse($studentData);
        } catch (\Exception $e) {
            return $this->handleException($e);
        }
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
