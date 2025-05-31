<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Traits\CrudOperations;
use App\Traits\GeneratesMatricule;
use App\Models\Professeur;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\AcademicYear;
use App\Models\GroupProfesseur;
use Carbon\Carbon;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class ProfesseurController extends Controller
{
    use CrudOperations, GeneratesMatricule;

    protected string $model = Professeur::class;

protected array $validationRules = [
    // User validation rules
    'EmailPR' => 'required|email|max:255|unique:users,EmailUT',
    'PhonePR' => 'nullable|string|max:20',
    'NomPL' => 'required|string|max:255',
    'PrenomPL' => 'required|string|max:255',
    'GenrePL' => 'required|string|in:Femme,Homme',
    'AdressPL' => 'nullable|string|max:255',
    'VillePL' => 'nullable|string|max:255',
    'CodePostalPL' => 'nullable|string|max:20',
    'PaysPL' => 'nullable|string|max:255',
    'NationalitePL' => 'nullable|string|max:255',
    'LieuNaissancePL' => 'nullable|string|max:255',
    'DateNaissancePL' => 'nullable|date',
    'ObservationPL' => 'nullable|string',
    'ProfileFileNamePL' => 'nullable|string|max:255',
    
    // Professeur validation rules
    'CINPR' => 'required|string|max:255|unique:professeurs,CINPR',
    'CivilitePR' => 'nullable|string|max:255',
    'DateEmbauchePR' => 'nullable|date',
    'SalairePR' => 'nullable|numeric',
    'NomBanquePR' => 'nullable|string|max:255',
    'RIBPR' => 'nullable|string|max:255',
    'MatriculeMT' => 'nullable|string|exists:matieres,MatriculeMT', // Changed to nullable
    'MatriculeYR' => 'required|string|exists:academic_years,MatriculeYR',
    'Groups' => 'nullable|array',
    'Groups.*' => 'exists:groups,MatriculeGP',
];
    protected static function getMatriculePrefix()
    {
        return 'PR';
    }
public function index(): \Illuminate\Http\JsonResponse
{
    try {
        $professeurs = $this->model::with([
            'user',
            'matiere',
            'attendances',
            'teacherVocations',
            'groups.niveau'
        ])->withCount('groups')->get();

        foreach ($professeurs as $professeur) {
            // Process attendance statistics
            $professeur->attendances = [
                'Present' => $professeur->attendances->where('StatutAT', 'Present')->count(),
                'Absent' => $professeur->attendances->where('StatutAT', 'Absent')->count(),
                'Late' => $professeur->attendances->where('StatutAT', 'Late')->count(),
                'Excused' => $professeur->attendances->where('StatutAT', 'Excused')->count(),
                'total' => $professeur->attendances->count(),
            ];

            // Process group niveau names
            $professeur->groups->each(function ($group) {
                $group->niveauName = $group->niveau ? $group->niveau->NomNV : null;
                unset($group->niveau);
            });

            // Process vocation statistics
            $anneeActuelle = AcademicYear::where('IsCurrentYR', true)->first();

            if ($anneeActuelle) {
                $vocationsActuelles = $professeur->teacherVocations
                    ->where('MatriculeYR', $anneeActuelle->MatriculeYR);
            
                $totalJoursActuelle = $vocationsActuelles->sum(function ($v) {
                    $start = Carbon::parse($v->StartDatetV);
                    $end = Carbon::parse($v->EndDateTV);
                    return $start->diffInDays($end) + 1;
                });
            
                $professeur->teacherVocations = [
                    'NomAnnee' => $anneeActuelle->NameYR,
                    'TotalJours' => $totalJoursActuelle,
                    'NombreConges' => $vocationsActuelles->count(),
                ];
            } else {
                $professeur->teacherVocations = [
                    'message' => 'Aucune année académique active trouvée.'
                ];
            }
        }

        return $this->successResponse($professeurs);
    } catch (\Exception $e) {
        return $this->handleException($e);
    }
}
  public function store(Request $request): \Illuminate\Http\JsonResponse
{
    try {
        DB::beginTransaction();

        // Validate request data
        $validatedData = $this->validateRequest($request, $this->validationRules);
        $username = $validatedData["PrenomPL"] && $validatedData["NomPL"] ? $validatedData["PrenomPL"]." ".$validatedData["NomPL"] : null;
        $password = Str::random(8);
        $validationCode = Str::random(8);
        $user = new User([
            'UserNameUT' => $username,
            'EmailUT' => $validatedData['EmailPR'],
            'PhoneUT' => $validatedData['PhonePR'] ?? null,
            'PasswordUT' => Hash::make($password),
            'RoleUT' => "professeur",
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

        // Create Professeur with user reference
        $professeur = new Professeur([
            'CINPR' => $validatedData['CINPR'],
            'CivilitePR' => $validatedData['CivilitePR'],                
            'DateEmbauchePR' => $validatedData['DateEmbauchePR'],
            'SalairePR' => $validatedData['SalairePR'],
            'NomBanquePR' => $validatedData['NomBanquePR'],
            'RIBPR' => $validatedData['RIBPR'],
            'MatriculeMT' => $validatedData['MatriculeMT'] ?? null,
            'MatriculeYR' => $validatedData['MatriculeYR'],
            'MatriculeUT' => $user->MatriculeUT,
        ]);
        $professeur->save();
        
        $groupIds = isset($validatedData["Groups"]) ? $validatedData["Groups"] : [];
        if (!empty($groupIds)) {
            foreach ($groupIds as $matriculeGP) {
                GroupProfesseur::updateOrCreate(
                    [
                        'MatriculePR' => $professeur->MatriculePR,
                        'MatriculeGP' => $matriculeGP,
                    ]
                );
            }
        }

        DB::commit();

        // Load relationships and add niveau names
        $professeur->load(['user', 'groups.niveau']);
        $professeur->groups->each(function ($group) {
            $group->niveauName = $group->niveau ? $group->niveau->NomNV : null;
            unset($group->niveau);
        });

        $result = [
            "professeur" => $professeur,
            "userInfo" => [
                "username" => $username,
                "password" => $password,
                "validationCode" => $validationCode,
                'EmailUT' => $validatedData['EmailPR'] ?? null,
                'PhoneUT' => $validatedData['PhonePR'] ?? null,
            ]
        ];

        return $this->successResponse($result, 'created');
    } catch (\Exception $e) {
        DB::rollBack();
        Log::error('Error creating professeur: ' . $e->getMessage());
        return $this->errorResponse($e->getMessage(), 500);
    }
}
    public function show($matricule): \Illuminate\Http\JsonResponse
    {
        try {
            $professeur = $this->model::with(['user', 'matieres', 'attendances', 'teacherVocations', 'regularTimeTables'])
                ->where('MatriculePR', $matricule)
                ->firstOrFail();
            return $this->successResponse($professeur);
        } catch (\Exception $e) {
            return $this->handleException($e);
        }
    }

public function update(Request $request, $matricule): \Illuminate\Http\JsonResponse
{
    try {
        DB::beginTransaction();

        // Find the Professeur
        $professeur = Professeur::where('MatriculePR', $matricule)->first();
        if (!$professeur) {
            return $this->notFoundResponse($this->getResourceName());
        }

        // Get the associated User
        $user = User::where('MatriculeUT', $professeur->MatriculeUT)->first();
        if (!$user) {
            return $this->notFoundResponse('User');
        }

        // Modify validation rules for update
        $rules = $this->validationRules;
        $rules['EmailPR'] = 'required|email|max:255|unique:users,EmailUT,' . $user->MatriculeUT . ',MatriculeUT';
        $rules['CINPR'] = 'required|string|max:255|unique:professeurs,CINPR,' . $professeur->MatriculePR . ',MatriculePR';

        // Validate request data
        $validatedData = $this->validateRequest($request, $rules);

        // Update User data
        $user->update([
            'EmailUT' => $validatedData['EmailPR'],
            'PhoneUT' => $validatedData['PhonePR'] ?? null,
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

        // Update Professeur data
        $professeur->update([
            'CINPR' => $validatedData['CINPR'],
            'CivilitePR' => $validatedData['CivilitePR'] ?? null,
            'PhonePR' => $validatedData['PhonePR'] ?? null,
            'DateEmbauchePR' => $validatedData['DateEmbauchePR'] ?? null,
            'SalairePR' => $validatedData['SalairePR'] ?? null,
            'NomBanquePR' => $validatedData['NomBanquePR'] ?? null,
            'RIBPR' => $validatedData['RIBPR'] ?? null,
            'MatriculeMT' => $validatedData['MatriculeMT'] ?? null, // Handle nullable
            'MatriculeYR' => $validatedData['MatriculeYR'],
        ]);

        // Handle professor assignments using GroupProfesseur pivot
        $newGroupIds = $validatedData["Groups"] ?? [];
        $currentGroupIds = GroupProfesseur::where('MatriculePR', $professeur->MatriculePR)
            ->pluck('MatriculeGP')
            ->toArray();
        $GroupsToAdd = array_diff($newGroupIds, $currentGroupIds);
        $GroupsToRemove = array_diff($currentGroupIds, $newGroupIds);
        if (!empty($GroupsToAdd)) {
            foreach ($GroupsToAdd as $matriculeGP) {
                GroupProfesseur::updateOrCreate(
                    [
                        'MatriculePR' => $professeur->MatriculePR,
                        'MatriculeGP' => $matriculeGP,
                    ]
                );
            }
        }

        if (!empty($GroupsToRemove)) {
            GroupProfesseur::where('MatriculePR', $professeur->MatriculePR)
                ->whereIn('MatriculeGP', $GroupsToRemove)
                ->delete();
        }

        DB::commit();

        // Load relationships and return updated data
        $professeur->load(['user', 'groups']);
        return $this->successResponse($professeur, 'updated');

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

            $professeur = Professeur::where('MatriculePR', $matricule)->firstOrFail();
            
            // Delete associated user
            $user = User::where('MatriculeUT', $professeur->MatriculeUT)->first();
            if ($user) {
                $user->delete();
            }

            // Remove professor assignments from pivot table
            GroupProfesseur::where('MatriculePR', $professeur->MatriculePR)
                ->delete();

            // Delete the professeur (might be redundant due to cascade, but keeping for safety)
            $professeur->delete();


            DB::commit();
            return $this->successResponse(null, 'deleted');

        } catch (\Exception $e) {
            DB::rollBack();
            return $this->handleException($e);
        }
    }
    public function getAllEmailPhoneUserNameArray() 
    {
        $emails = User::pluck('EmailUT')->toArray();
        $phones = User::pluck('PhoneUT')->toArray();
        $noms = User::pluck('NomPL')->toArray();
        $prenoms = User::pluck('PrenomPL')->toArray();
        return [
            'emails' => $emails,
            'phones' => $phones,
            'noms' => $noms,
            'prenoms' => $prenoms,
        ];
    }
    public function getAllProfesseursSelect ($MatriculeGP = null) 
    {
        try {
            // Fetch professeurs with no MatriculeGP
            $unassignedProfesseurs = Professeur::doesntHave('groups')
                ->get()
                ->map(function ($prof) {
                    return [
                        'MatriculePR' => $prof->MatriculePR,
                        'FullNamePR' => $prof ? "{$prof->user->PrenomPL} {$prof->user->NomPL}" : 'Unknown',
                    ];
                });

            // Fetch professeurs with the provided MatriculeGP
            $selectedProfesseurs = $MatriculeGP
                ? GroupProfesseur::with('professeur')
                    ->where('MatriculeGP', $MatriculeGP)
                    ->get()
                    ->map(function ($prof) {
                        return [
                            'MatriculePR' => $prof->professeur->MatriculePR,
                            'FullNamePR' => $prof->professeur && $prof?->professeur?->user ? "{$prof->professeur->user->PrenomPL} {$prof->professeur->user->NomPL}" : 'Unknown',
                        ];
                    })
                : collect([]);

            // Combine both collections
            $professeurs = $unassignedProfesseurs->merge($selectedProfesseurs);

            return [
                'professeurs' => $professeurs,
                'selectedPR' => $selectedProfesseurs,
            ];
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while fetching professeurs'], 500);
        }
    }
}
