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
        'NameEP' => 'required|string|max:255',
        'MaxGradeEP' => 'nullable|numeric',
        'PorsentageEP' => 'nullable|numeric',
        'DescriptionEP' => 'nullable|string',
        'CodeEP' => 'required|string|max:255',
    ];

    // Define resource name for messages
    protected string $resourceName = 'Evaluation Type';

    // Methods provided by CrudOperations trait
}
