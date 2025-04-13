<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Traits\CrudOperations;
use App\Models\EvaluationType;
use Illuminate\Http\Request;

class EvaluationTypeController extends Controller
{
    use CrudOperations;

    protected string $model = EvaluationType::class;

    protected array $validationRules = [
        'nameEp' => 'required|string|max:255',
        'max_gradeEp' => 'nullable|numeric',
        'porsentageEp' => 'nullable|numeric',
        'descriptionEp' => 'nullable|string',
        'codeEp' => 'required|string|max:255',
    ];

    // Define resource name for messages
    protected string $resourceName = 'Evaluation Type';

    // Methods provided by CrudOperations trait
}
