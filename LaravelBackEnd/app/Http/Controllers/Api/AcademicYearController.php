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
        'StatusYR' => 'required|string|max:255',
        'NameYR' => 'required|string|max:255',
        'DescriptionYR' => 'nullable|string',
        'StartDateYR' => 'required|date',
        'EndDateYR' => 'required|date|after_or_equal:StartDateYR',
        'ArchivedDateYR' => 'nullable|date',
        'IsCurrentYR' => 'sometimes|boolean',
        'MatriculeUT' => 'required|string|exists:users,MatriculeUT',
    ];

    // Define resource name for messages
    protected string $resourceName = 'Academic Year';

    // Methods provided by CrudOperations trait
}
