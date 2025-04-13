<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Traits\CrudOperations;
use App\Models\AcademicYear;
use Illuminate\Http\Request;

class AcademicYearController extends Controller
{
    use CrudOperations;

    protected string $model = AcademicYear::class;

    protected array $validationRules = [
        'statusYR' => 'required|string|max:255',
        'NameYR' => 'required|string|max:255',
        'descriptionYR' => 'nullable|string',
        'startDateYR' => 'required|date',
        'endDateYR' => 'required|date|after_or_equal:startDateYR',
        'ArchivedDateYR' => 'nullable|date',
        'isCurrentYR' => 'sometimes|boolean',
        'matriculeUt' => 'required|string|exists:users,matriculeUt',
    ];

    // Define resource name for messages
    protected string $resourceName = 'Academic Year';

    // Methods provided by CrudOperations trait
}
