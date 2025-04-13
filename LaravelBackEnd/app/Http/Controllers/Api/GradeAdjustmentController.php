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
        'typeGA' => 'required|string|max:255',
        'valueGA' => 'required|numeric',
        'reasonGA' => 'nullable|string',
        'DateGa' => 'required|date',
        'matriculeER' => 'required|string|exists:evaluation_results,matriculeER',
    ];

    // Define resource name for messages
    protected string $resourceName = 'Grade Adjustment';

    // Methods provided by CrudOperations trait
}
