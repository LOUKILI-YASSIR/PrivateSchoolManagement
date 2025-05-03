<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Traits\CrudOperations;
use App\Models\GradeAdjustment;
use Illuminate\Http\Request;

class GradeAdjustmentController extends Controller
{
    use CrudOperations;

    protected string $model = GradeAdjustment::class;

    protected array $validationRules = [
        'TypeGA' => 'required|string|max:255',
        'ValueGA' => 'required|numeric',
        'ReasonGA' => 'nullable|string',
        'DateGA' => 'required|date',
        'MatriculeER' => 'required|string|exists:evaluation_results,MatriculeER',
    ];

    // Define resource name for messages
    protected string $resourceName = 'Grade Adjustment';

    // Methods provided by CrudOperations trait
}
