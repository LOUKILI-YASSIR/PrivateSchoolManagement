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
        'MatriculeET' => 'required|string|exists:etudiants,MatriculeET',
        'MatriculeEV' => 'required|string|exists:evaluations,MatriculeEV',
        'GradeER' => 'required|numeric|min:0',
        'CommentaireER' => 'nullable|string|max:255',
    ];

    // Define resource name for messages
    protected string $resourceName = 'Evaluation Result';

    // Methods provided by CrudOperations trait
}
