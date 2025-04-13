<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Traits\CrudOperations;
use App\Models\EvaluationResult;
use Illuminate\Http\Request;

class EvaluationResultController extends Controller
{
    use CrudOperations;

    protected string $model = EvaluationResult::class;

    protected array $validationRules = [
        'matriculeEt' => 'required|string|exists:etudiants,matriculeEt',
        'matriculeEv' => 'required|string|exists:evaluations,matriculeEv',
        'GradeER' => 'required|numeric|min:0',
        'commentaireER' => 'nullable|string|max:255',
    ];

    // Define resource name for messages
    protected string $resourceName = 'Evaluation Result';

    // Methods provided by CrudOperations trait
}
