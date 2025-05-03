<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Traits\CrudOperations;
use App\Models\SpecialDaySchedule;
use Illuminate\Http\Request;

class SpecialDayScheduleController extends Controller
{
    use CrudOperations;

    protected string $model = SpecialDaySchedule::class;

    protected array $validationRules = [
        'DateSS' => 'required|date',
        'IsFullDaySS' => 'sometimes|boolean',
        'MatriculeTS' => 'required|string|exists:time_slots,MatriculeTS',
        'LocationSS' => 'nullable|string|max:255',
        'ActivityNameSS' => 'nullable|string|max:255',
    ];

    // Define resource name for messages
    protected string $resourceName = 'Special Day Schedule';

    // Methods provided by CrudOperations trait
}
