<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Traits\CrudOperations;
use App\Models\User;
use App\Models\Evaluation;
use Illuminate\Http\Request;

class EvaluationController extends Controller
{
    use CrudOperations;

    protected string $model = Evaluation::class;

    protected array $validationRules = [
        'MatriculeMT' => 'required|string|exists:matieres,MatriculeMT',
        'MatriculeEP' => 'required|string|exists:evaluation_types,MatriculeEP',
        'NbrEV' => 'nullable|integer|min:0',
    ];

    // Define resource name for messages
    protected string $resourceName = 'Evaluation';

    /**
     * Display a listing of evaluations with related data.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        try {
            $evaluations = $this->model::with([
                'matiere',
                'evaluationType',
                'matiere.niveau',
                'evaluationResults'
            ])->get();
            foreach ($evaluations as $evaluation) {
                $niveau = $evaluation->matiere->niveau;
                if ($niveau) {
                    $niveauName = $niveau->NomNV;

                    $fullNiveauName = $niveauName;

                    $evaluation->niveau_name = $fullNiveauName;
                }
                $results = $evaluation->evaluationResults;

                if ($results && $results->count() > 0) {
                    // Min and Max GradeER
                    $minGrade = $results->min('GradeER');
                    $maxGrade = $results->max('GradeER');

                    // Assign to evaluation object for later use if needed
                    $evaluation->min_grade = $minGrade;
                    $evaluation->max_grade = $maxGrade;
                }
                unset($evaluation->evaluationResults);
            }
            return $this->successResponse($evaluations);
        } catch (\Exception $e) {
            return $this->handleException($e);
        }
    }

    // Methods provided by CrudOperations trait
}
