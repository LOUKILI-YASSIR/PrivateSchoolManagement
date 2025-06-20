<?php

namespace App\Http\Controllers\API;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Log;

use App\Models\Matiere;
use App\Models\Evaluation;
use App\Models\AcademicYear;
use App\Models\DayWeek;
use App\Models\EvaluationType;
use App\Models\Niveau;
use App\Models\Professeur;
use App\Models\TimeSlot;
use App\Models\User;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MatiereController extends Controller
{
    public function getModelClass()
{
    return Matiere::class;
}

    /**
     * Store a newly created Matiere in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
 public function store(Request $request)
{
    try {
        $max_of_max_sessions_per_week = TimeSlot::count() * DayWeek::count();
        $validated = $request->validate([
            'MatriculeYR' => 'required|string|exists:academic_years,MatriculeYR',
            'NameMT' => 'required|string|max:255',
            'CodeMT' => 'required|string|max:255|unique:matieres',
            'max_sessions_per_week' => 'required|integer|min:0|max:'.$max_of_max_sessions_per_week ,
            'CoefficientMT' => 'required|integer',
            'MatriculeNV' => 'required|string|exists:niveaux,MatriculeNV',
            'DescriptionMT' => 'nullable|string',
            'professeurs' => 'nullable|array',
            'professeurs.*.MatriculePR' => 'nullable|string|exists:professeurs,MatriculePR',
            'NbrEVMT' => 'nullable|integer',
            'Evaluations' => 'nullable|array',
            'Evaluations.*.MatriculeEP' => 'nullable|exists:evaluation_types,MatriculeEP',
            'Evaluations.*.NbrEV' => 'nullable|integer|min:1',
        ]);

        return DB::transaction(function () use ($validated) {
            // Générer un matricule unique pour la matière

            // Créer la matière
            $matiere = Matiere::create([
                'NameMT' => $validated['NameMT'],
                'CodeMT' => $validated['CodeMT'],
                'max_sessions_per_week' => $validated['max_sessions_per_week'],
                'CoefficientMT' => $validated['CoefficientMT'],
                'MatriculeNV' => $validated['MatriculeNV'],
                'DescriptionMT' => $validated['DescriptionMT'],
                'NbrEVMT' => $validated['NbrEVMT'] ?? 0,
                'MatriculeYR' => $validated['MatriculeYR'],
            ]);

            // Mettre à jour les professeurs avec le MatriculeMT
            Professeur::whereIn('MatriculePR', $validated['professeurs'])
                ->update(['MatriculeMT' => $matiere->MatriculeMT]);
            if(!$validated['Evaluations']){
                // Créer les évaluations
                foreach ($validated['Evaluations'] as $evaluationData) {
                    Evaluation::create([
                        'MatriculeMT' => $matiere->MatriculeMT,
                        'MatriculeEP' => $evaluationData['MatriculeEP'],
                        'MatriculeYR' => $validated['MatriculeYR'],
                        'NbrEV' => $evaluationData['NbrEV'],
                    ]);
                }
            }
            return response()->json([
                'message' => 'Matière créée avec succès',
                'matiere' => $matiere,
            ], 201);
        });
    } catch (Exception $e) {
        Log::error($e->getMessage());
        return response()->json([
            'error' => 'Erreur lors de la création de la matière',
            'details' => $e->getMessage()
        ], 500);
    }
}


    /**
     * Update the specified Matiere in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  string  $matriculeMT
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $matriculeMT)
{
    try {
        $max_of_max_sessions_per_week = TimeSlot::count() * DayWeek::count();
        $validated = $request->validate([
            'MatriculeYR' => 'required|string|exists:academic_years,MatriculeYR',
            'NameMT' => 'required|string|max:255',
            'CodeMT' => 'required|string|max:255',
            'CoefficientMT' => 'required|integer',
            'max_sessions_per_week' => 'required|integer|min:0|max:'.$max_of_max_sessions_per_week ,
            'MatriculeNV' => 'required|string|exists:niveaux,MatriculeNV',
            'DescriptionMT' => 'nullable|string',
            'professeurs' => 'nullable|array',
            'professeurs.*.MatriculePR' => 'exists:professeurs,MatriculePR',
            'NbrEVMT' => 'nullable|integer',
            'Evaluations' => 'nullable|array',
            'Evaluations.*.MatriculeEP' => 'nullable|exists:evaluation_types,MatriculeEP',
            'Evaluations.*.NbrEV' => 'nullable|integer|min:1',
        ]);

        return DB::transaction(function () use ($validated, $matriculeMT) {
            // Trouver la matière
            $matiere = Matiere::findOrFail($matriculeMT);

            // Mise à jour des infos de la matière
            $matiere->update([
                'NameMT' => $validated['NameMT'],
                'CodeMT' => $validated['CodeMT'],
                'max_sessions_per_week' => $validated['max_sessions_per_week'],
                'CoefficientMT' => $validated['CoefficientMT'],
                'MatriculeNV' => $validated['MatriculeNV'],
                'DescriptionMT' => $validated['DescriptionMT'],
                'MatriculeYR' => $validated['MatriculeYR'],
                'NbrEVMT' => $validated['NbrEVMT'] ?? 0
            ]);

            // Détacher les anciens professeurs associés
            Professeur::where('MatriculeMT', $matiere->MatriculeMT)
                ->whereNotIn('MatriculePR', $validated['professeurs'])
                ->update(['MatriculeMT' => null]);

            // Associer les nouveaux professeurs à la matière
            Professeur::whereIn('MatriculePR', $validated['professeurs'])
                ->update(['MatriculeMT' => $matiere->MatriculeMT]);

            // Supprimer les anciennes évaluations
            Evaluation::where('MatriculeMT', $matiere->MatriculeMT)->delete();
            if($validated['Evaluations']){
                // Créer les nouvelles évaluations
                foreach ($validated['Evaluations'] as $evaluationData) {
                    Evaluation::create([
                        'MatriculeMT' => $matiere->MatriculeMT,
                        'MatriculeEP' => $evaluationData['MatriculeEP'],
                        'MatriculeYR' => $matiere->MatriculeYR,
                        'NbrEV' => $evaluationData['NbrEV'],
                    ]);
                }
            }
            return response()->json([
                'message' => 'Matière mise à jour avec succès',
                'matiere' => $matiere,
            ], 200);
        });
    } catch (Exception $e) {
        Log::error($e->getMessage());
        return response()->json([
            'error' => 'Erreur lors de la mise à jour de la matière',
            'details' => $e->getMessage(),
        ], 500);
    }
}


    /**
     * Remove the specified Matiere from storage.
     *
     * @param  string  $matriculeMT
     * @return \Illuminate\Http\JsonResponse
     */
public function destroy($matriculeMT)
{
    return DB::transaction(function () use ($matriculeMT) {
        $matiere = Matiere::findOrFail($matriculeMT);

        // Supprimer les évaluations
        $matiere->evaluations()->delete();

        // Détacher les professeurs en mettant MatriculeMT à null
        Professeur::where('MatriculeMT', $matiere->MatriculeMT)->update(['MatriculeMT' => null]);

        // Supprimer la matière
        $matiere->delete();

        return response()->json([
            'message' => 'Matière supprimée avec succès'
        ], 200);
    });
}

/**
     * Display a listing of the resource with related data.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(): JsonResponse
{
    try {
        $records = $this->getModelClass()::with([
            'niveau',
            'evaluations',
            'notes',
            'professeurs'
        ])->get();

        foreach ($records as $record) {
            // Process niveau name
            $record->niveau_name = $record->niveau ? $record->niveau->NomNV : null;
            unset($record->niveau);

            // Total number of evaluations
            $record->total_evaluations = $record->evaluations->sum('NbrEV');

            // Sort notes by grade
            $notes = $record->notes;
            $sortedByGrade = $notes->sortBy('GradeNT')->values();

            $lowestNote = $sortedByGrade->first();
            $record->lowest_note_grade = $lowestNote?->GradeNT;

            $highestNote = $sortedByGrade->last();
            $record->highest_note_grade = $highestNote?->GradeNT;

            unset($record->notes);
        }

        return $this->successResponse($records, 'retrieved');

    } catch (Exception $e) {
        return $this->handleException($e);
    }
}

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    // store() provided by CrudOperations trait

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Matiere  $matiere
     * @return \Illuminate\Http\Response
     */
    // show() provided by CrudOperations trait

public function show($matriculeUT)
{
    $user = User::with('etudiant.niveau.matieres')->where('MatriculeUT', $matriculeUT)->first();
    $matieres = [];
    if($user->RoleUT === "etudiant"){
        $matieres = $user->etudiant->niveau->matieres;
    }
    return response()->json($matieres);
}

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Matiere  $matiere
     * @return \Illuminate\Http\Response
     */
    // update() provided by CrudOperations trait

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Matiere  $matiere
     * @return \Illuminate\Http\Response
     */
    // destroy() provided by CrudOperations trait
public function getAllMatieresNamesArray($MatriculeMT = null)
{
    try {
        // Professeurs non assignés à une matière
        $unassignedProfesseurs = Professeur::whereNull('MatriculeMT')
            ->get()
            ->map(function ($prof) {
                return [
                    'MatriculePR' => $prof->MatriculePR,
                    'FullNamePR' => $prof->user
                        ? "{$prof->user->PrenomPL} {$prof->user->NomPL}"
                        : 'Inconnu',
                ];
            });

        // Professeurs déjà assignés à la matière spécifiée
        $selectedProfesseurs = $MatriculeMT
            ? Professeur::where('MatriculeMT', $MatriculeMT)
                ->get()
                ->map(function ($prof) {
                    return [
                        'MatriculePR' => $prof->MatriculePR,
                        'FullNamePR' => $prof->user
                            ? "{$prof->user->PrenomPL} {$prof->user->NomPL}"
                            : 'Inconnu',
                    ];
                })
            : collect([]);

        // Fusionner les deux collections (corrigé avec collect())
        $professeurs = collect($unassignedProfesseurs)->merge(collect($selectedProfesseurs))
            ->unique('MatriculePR')
            ->values();

        // Préparer les données à retourner (convertir en tableaux pour cohérence)
        $professeursData = [
            'professeurs' => $professeurs->toArray(),
            'selectedPR' => $selectedProfesseurs->toArray(),
        ];

        $niveauxData = Niveau::select("NomNV", "MatriculeNV")->get()->toArray();
        $evaluationTypesData = EvaluationType::all()->toArray();
        $max_of_max_sessions_per_week = TimeSlot::count() * DayWeek::count();

        return [
            "noms" => Matiere::pluck("NameMT")->toArray(),
            "professeurs" => $professeursData,
            "niveaux" => $niveauxData,
            "evaluation-types" => $evaluationTypesData,
            "max_sessions_per_week" => $max_of_max_sessions_per_week
        ];

    } catch (Exception $e) {
        Log::error($e->getMessage());
        return response()->json([
            'error' => 'Erreur lors de la récupération des données',
            'details' => $e->getMessage()
        ], 500);
    }
}

}
