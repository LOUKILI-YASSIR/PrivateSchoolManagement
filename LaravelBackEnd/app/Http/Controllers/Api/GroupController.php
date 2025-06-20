<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Traits\CrudOperations;
use App\Models\Group;
use App\Models\Etudiant;
use App\Models\GroupProfesseur;
use App\Models\Professeur;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class GroupController extends Controller
{
    use CrudOperations;

    protected string $model = Group::class;

    protected array $validationRules = [
        'NameGP' => 'required|string|max:255|unique:groups,NameGP', // Added unique constraint
        'DescriptionGP' => 'nullable|string|max:1000', // Increased max length for description
        'MatriculeNV' => 'nullable|string|exists:niveaux,MatriculeNV', // Kept nullable
        'MatriculeYR' => 'required|string|exists:academic_years,MatriculeYR',
        'Etudiants' => 'nullable|array', // Removed min:1 to make truly optional
        'Etudiants.*' => 'exists:etudiants,MatriculeET',
        'Professeurs' => 'nullable|array', // Removed min:1 to make truly optional
        'Professeurs.*' => 'exists:professeurs,MatriculePR',
    ];

    protected string $resourceName = 'Group';

    /**
     * Update the specified resource with validated data.
     *
     * @param \App\Models\Group $group
     * @param array $data
     * @return \App\Models\Group
     */
    protected function updateResource($group, array $data)
    {
        $group->update($data);
        return $group;
    }

    /**
     * Display a listing of groups with related data.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        try {
            $groups = $this->model::with(['niveau', 'etudiants', 'professeurs'])
                ->withCount('etudiants')
                ->withCount('professeurs')
                ->get();

            // Simplify niveau data to include only direct niveau name
            $groups = $groups->map(function ($group) {
                $groupData = $group->toArray();
                $groupData['niveauName'] = $group->niveau ? $group->niveau->NomNV : null;
                return $groupData;
            });

            return $this->successResponse($groups);
        } catch (\Exception $e) {
            return $this->handleException($e);
        }
    }

    /**
     * Store a newly created group and assign students and professors.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    protected function createResource(array $data)
    {
        return $this->model::create($data);
    }

    public function store(Request $request)
    {
        try {
            $validatedData = $this->validateRequest($request, $this->validationRules);

            return DB::transaction(function () use ($validatedData, $request) {
                $group = $this->createResource($validatedData);

                $studentIds = $request->input('Etudiants', []);
                $professeurIds = $request->input('Professeurs', []);

                if (!empty($studentIds) && is_array($studentIds)) {
                    Etudiant::whereIn('MatriculeET', $studentIds)
                        ->update(['MatriculeGP' => $group->MatriculeGP, 'MatriculeNV' => $validatedData['MatriculeNV'] ?? null]);
                }

                if (!empty($professeurIds) && is_array($professeurIds)) {
                    foreach ($professeurIds as $matriculePR) {
                        GroupProfesseur::updateOrCreate(
                            [
                                'MatriculePR' => $matriculePR,
                                'MatriculeGP' => $group->MatriculeGP,
                            ]
                        );
                    }
                }

                $group->load(['niveau']);
                $group->etudiants_count = is_array($studentIds) ? count($studentIds) : 0; // Handle null case
                $group->professeurs_count = is_array($professeurIds) ? count($professeurIds) : 0; // Handle null case
                $group->niveauName = $group->niveau ? $group->niveau->NomNV : null;

                return $this->successResponse($group, 'Group created successfully');
            });
        } catch (\Exception $e) {
            return $this->handleException($e);
        }
    }

    /**
     * Update an existing group and manage student and professor assignments.
     *
     * @param \Illuminate\Http\Request $request
     * @param string $id
     * @return \Illuminate\Http\JsonResponse
     */
/**
 * Update an existing group and manage student and professor assignments.
 *
 * @param \Illuminate\Http\Request $request
 * @param string $id
 * @return \Illuminate\Http\JsonResponse
 */
public function update(Request $request, $id)
{
    try {
        if (empty($id)) {
            return $this->errorResponse('Group MatriculeGP is required', 400);
        }

        $validatedData = $this->validateRequest($request, array_merge($this->validationRules, [
            'NameGP' => 'required|string|max:255|unique:groups,NameGP,' . $id . ',MatriculeGP',
            'Etudiants' => 'nullable|array',
            'Professeurs' => 'nullable|array',
        ]));

        return DB::transaction(function () use ($validatedData, $request, $id) {
            $group = $this->model::findOrFail($id); // Queries MatriculeGP column
            $this->updateResource($group, $validatedData);

            // Handle student assignments
            $newStudentIds = $request->input('Etudiants', []) ?? []; // Normalize null to empty array
            $currentStudentIds = Etudiant::where('MatriculeGP', $group->MatriculeGP)
                ->pluck('MatriculeET')
                ->toArray();

            $studentsToAdd = array_diff($newStudentIds, $currentStudentIds);
            $studentsToRemove = array_diff($currentStudentIds, $newStudentIds);

            Log::info('MatriculeNV: ' . $validatedData["MatriculeNV"]);
            Log::info('Current Students: ' . implode(', ', $currentStudentIds));
            Log::info('To Add: ' . implode(', ', $studentsToAdd));
            Log::info('To Remove: ' . implode(', ', $studentsToRemove));

            if(!empty($currentStudentIds)){
                Etudiant::whereIn('MatriculeET', $currentStudentIds)
                    ->update(['MatriculeGP' => $group->MatriculeGP, 'MatriculeNV' => $validatedData['MatriculeNV'] ?? null]);
            }

            if (!empty($studentsToAdd)) {
                Etudiant::whereIn('MatriculeET', $studentsToAdd)
                    ->update(['MatriculeGP' => $group->MatriculeGP, 'MatriculeNV' => $validatedData['MatriculeNV']]);
            }

            if (!empty($studentsToRemove)) {
                Etudiant::whereIn('MatriculeET', $studentsToRemove)
                    ->update(['MatriculeGP' => null]);
            }

            // Handle professor assignments
            $newProfesseurIds = $request->input('Professeurs', []) ?? []; // Normalize null to empty array
            $currentProfesseurIds = GroupProfesseur::where('MatriculeGP', $group->MatriculeGP)
                ->pluck('MatriculePR')
                ->toArray();

            $professeursToAdd = array_diff($newProfesseurIds, $currentProfesseurIds);
            $professeursToRemove = array_diff($currentProfesseurIds, $newProfesseurIds);

            Log::info('MatriculeNV: ' . $validatedData["MatriculeNV"]);
            Log::info('Current Students: ' . implode(', ', $currentProfesseurIds));
            Log::info('To Add: ' . implode(', ', $professeursToAdd));
            Log::info('To Remove: ' . implode(', ', $professeursToRemove));

            if(!empty($currentProfesseurIds)){
                foreach ($currentProfesseurIds as $matriculePR) {
                    GroupProfesseur::updateOrCreate(
                        [
                            'MatriculePR' => $matriculePR,
                            'MatriculeGP' => $group->MatriculeGP,
                        ]
                    );
                }
            }

            if (!empty($professeursToAdd)) {
                foreach ($professeursToAdd as $matriculePR) {
                    GroupProfesseur::updateOrCreate(
                        [
                            'MatriculePR' => $matriculePR,
                            'MatriculeGP' => $group->MatriculeGP,
                        ]
                    );
                }
            }

            if (!empty($professeursToRemove)) {
                GroupProfesseur::where('MatriculeGP', $group->MatriculeGP)
                    ->whereIn('MatriculePR', $professeursToRemove)
                    ->delete();
            }

            $group->load(['niveau']);
            $group->etudiants_count = count($newStudentIds);
            $group->professeurs_count = count($newProfesseurIds);
            $group->niveauName = $group->niveau ? $group->niveau->NomNV : null;

            return $this->successResponse($group, 'Group updated successfully');
        });
    } catch (\Exception $e) {
        Log::error($e->getMessage());
        return $this->handleException($e);
    }
}

    /**
     * Delete a group and remove its student and professor assignments.
     *
     * @param string $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        try {
            return DB::transaction(function () use ($id) {
                $group = $this->model::findOrFail($id);

                // Remove student assignments
                Etudiant::where('MatriculeGP', $group->MatriculeGP)
                    ->update(['MatriculeGP' => null, 'MatriculeNV' => null]);

                // Remove professor assignments from pivot table
                GroupProfesseur::where('MatriculeGP', $group->MatriculeGP)
                    ->delete();

                // Delete the group
                $this->deleteResource($group);

                return $this->successResponse(null, 'Group deleted successfully');
            });
        } catch (\Exception $e) {
            return $this->handleException($e);
        }
    }

    /**
     * Get all group names as an array.
     *
     * @return array
     */
public function getAllGroupsNamesArray()
{
    $groups = Group::select('NameGP', 'MatriculeGP')->get();
    return [
        'groups' => $groups,
    ];
}

    public function getAllGroupsSelect($MatriculePR = null)
    {
        try {
            // القاعات التي لا يوجد لها أستاذ
            $unassignedGroups = Group::doesntHave('professeurs')
                ->get()
                ->map(function ($group) {
                    return [
                        'MatriculeGP' => $group->MatriculeGP,
                        'NameGP' => $group->NameGP ?? 'Inconnu',
                    ];
                });

            // القاعات المرتبطة بالأستاذ المحدد
            $selectedGroups = $MatriculePR
                ? GroupProfesseur::with('group')
                    ->where('MatriculePR', $MatriculePR)
                    ->get()
                    ->map(function ($gp) {
                        return [
                            'MatriculeGP' => $gp->group->MatriculeGP ?? null,
                            'NameGP' => $gp->group->NameGP ?? 'Inconnu',
                        ];
                    })
                : collect([]);

            // دمج النتائج
            $groups = $unassignedGroups->merge($selectedGroups);

            return [
                'groups' => $groups,
                'selectedGP' => $selectedGroups,
            ];
        } catch (\Exception $e) {
            return response()->json(['error' => 'Une erreur s\'est produite lors de la récupération des groupes'], 500);
        }
    }
    /**
 * Get groups by niveau if MatriculeNV is provided, otherwise return all groups.
 *
 * @param string|null $MatriculeNV
 * @return \Illuminate\Http\JsonResponse
 */
public function getGroupsByNiveau($MatriculeNV = null)
{
    try {
        $query = $this->model::withCount('etudiants','professeurs');
        if ($MatriculeNV) {
            $query->where('MatriculeNV', $MatriculeNV);
        }

        $groups = $query->get();

        return $this->successResponse($groups);
    } catch (\Exception $e) {
        return $this->handleException($e);
    }
}
public function getFrontFormDataMerged($MatriculeGP = null)
{
    try {
        // 1. جلب جميع المستويات
        $niveaux = DB::table('niveaux')
            ->select('MatriculeNV', 'NomNV')
            ->get();

        // 2. جلب أسماء كل المجموعات
        $groupNames = Group::pluck('NameGP')->toArray();
        $countET=Etudiant::count();
        if($countET>0){
        // 3. الطلاب الغير مرتبطين
        $unassignedEtudiants = Etudiant::with('user')
            ->whereNull('MatriculeGP')
            ->get()
            ->map(function ($etudiant) {
                return [
                    'MatriculeET' => $etudiant->MatriculeET,
                    'FullNameET'  => $etudiant->user
                        ? "{$etudiant->user->PrenomPL} {$etudiant->user->NomPL}"
                        : 'Unknown',
                ];
            });
        // 4. الطلاب المرتبطين بالمجموعة المحددة
        $selectedEtudiants = $MatriculeGP
            ? Etudiant::with('user')
                ->where('MatriculeGP', $MatriculeGP)
                ->get()
                ->map(function ($etudiant) {
                    return [
                        'MatriculeET' => $etudiant->MatriculeET,
                        'FullNameET'  => $etudiant?->user
                            ? "{$etudiant?->user?->PrenomPL} {$etudiant?->user?->NomPL}"
                            : 'Unknown',
                    ];
                })
            : collect([]);
        // دمج الطلاب
        $etudiants = array_merge(
    $unassignedEtudiants->toArray(),
            $selectedEtudiants->toArray()
        );
    }
    $countPr= Professeur::count();
    if($countPr> 0){
            // 5. الأساتذة الغير مرتبطين بأي مجموعة
        $unassignedProfesseurs = Professeur::doesntHave('groups')
            ->with('user')
            ->get()
            ->map(function ($prof) {
                return [
                    'MatriculePR' => $prof->MatriculePR,
                    'FullNamePR'  => $prof->user
                        ? "{$prof->user->PrenomPL} {$prof->user->NomPL}"
                        : 'Unknown',
                ];
            });

        // 6. الأساتذة المرتبطين بالمجموعة المحددة
        $selectedProfesseurs = $MatriculeGP
            ? GroupProfesseur::with('professeur.user')
                ->where('MatriculeGP', $MatriculeGP)
                ->get()
                ->map(function ($gp) {
                    $prof = $gp->professeur;
                    return [
                        'MatriculePR' => $prof->MatriculePR,
                        'FullNamePR'  => $prof && $prof->user
                            ? "{$prof->user->PrenomPL} {$prof->user->NomPL}"
                            : 'Unknown',
                    ];
                })
            : collect([]);

        // دمج الأساتذة
        $professeurs = array_merge(
    $unassignedProfesseurs->toArray(),
            $selectedProfesseurs->toArray()
        );

            }
        return response()->json([
            'niveaux'       => $niveaux,
            'noms'    => $groupNames,
            'etudiants'     => $etudiants ?? [],
            'selectedET'    => $selectedEtudiants ?? [],
            'professeurs'   => $professeurs ?? [],
            'selectedPR'    => $selectedProfesseurs ?? [],
        ]);
    } catch (\Exception $e) {
        Log::error($e->getMessage());
        return response()->json(['error' => 'Erreur lors de la récupération des données'], 500);
    }
}
public function show($matricule)
{
    $professeur = Professeur::where('MatriculeUT', $matricule)->first();

    if (!$professeur) {
        return response()->json(['error' => 'Professeur non trouvé'], 404);
    }

    $groups = $professeur->groups()
        ->with(['niveau'])
        ->withCount(['etudiants', 'professeurs'])
        ->get()
        ->map(function ($group) {
            $niveau = $group->niveau;

            // تحويل كائن niveau إلى مصفوفة وتغيير المفتاح
            $niveauData = $niveau
                ? array_merge(
                    $niveau->toArray(),
                    ['niveauName' => $niveau->NomNV]
                )
                : null;

            return array_merge(
                $group->toArray(),
                ['niveau' => $niveauData]
            );
        })
        ->values();

    return response()->json($groups);
}


}
