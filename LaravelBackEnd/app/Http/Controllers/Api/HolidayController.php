<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Traits\CrudOperations;
use App\Models\Holiday;
use Illuminate\Http\Request;

class HolidayController extends Controller
{
    use CrudOperations;

    protected string $model = Holiday::class;

    protected array $validationRules = [
        'startdateHd' => 'required|date',
        'endDateHd' => 'required|date|after_or_equal:startdateHd',
        'nameHd' => 'required|string|max:255',
        'descriptionHd' => 'nullable|string',
        'matriculeYR' => 'required|string|exists:academic_years,matriculeYR',
    ];

    // Define resource name for messages
    protected string $resourceName = 'Holiday';

    // Methods provided by CrudOperations trait
}
