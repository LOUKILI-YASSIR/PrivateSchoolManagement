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
        'StartDateHD' => 'required|date',
        'EndDateHD' => 'required|date|after_or_equal:StartDateHD',
        'NameHD' => 'required|string|max:255',
        'DescriptionHD' => 'nullable|string',
        'MatriculeYR' => 'required|string|exists:academic_years,MatriculeYR',
    ];

    // Define resource name for messages
    protected string $resourceName = 'Holiday';

    // Methods provided by CrudOperations trait
}
