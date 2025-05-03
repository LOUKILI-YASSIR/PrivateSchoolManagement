<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Traits\CrudOperations;
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
                'evaluationResults'
            ])
            ->withCount('evaluationResults')
            ->get();

            return $this->successResponse($evaluations);
        } catch (\Exception $e) {
            return $this->handleException($e);
        }
    }

    // Methods provided by CrudOperations trait
}
