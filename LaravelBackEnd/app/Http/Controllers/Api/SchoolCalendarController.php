<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Traits\CrudOperations;
use App\Models\SchoolCalendar;
use Illuminate\Http\Request;

class SchoolCalendarController extends Controller
{
    use CrudOperations;

    protected string $model = SchoolCalendar::class;

    protected array $validationRules = [
        'calendarDateSc' => 'required|date',
        'dayTypeSc' => 'required|string|max:255',
        'matriculeYR' => 'required|string|exists:academic_years,matriculeYR',
    ];

    // Define resource name for messages
    protected string $resourceName = 'School Calendar Entry';

    // Methods provided by CrudOperations trait
}
