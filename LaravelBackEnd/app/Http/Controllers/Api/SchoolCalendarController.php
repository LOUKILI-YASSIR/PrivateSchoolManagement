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
        'CalendarDateSC' => 'required|date',
        'DayTypeSC' => 'required|string|max:255',
        'MatriculeYR' => 'required|string|exists:academic_years,MatriculeYR',
    ];

    // Define resource name for messages
    protected string $resourceName = 'School Calendar Entry';

    // Methods provided by CrudOperations trait
}
