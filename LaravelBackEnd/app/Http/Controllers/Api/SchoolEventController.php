<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Traits\CrudOperations;
use App\Models\SchoolEvent;
use Illuminate\Http\Request;

class SchoolEventController extends Controller
{
    use CrudOperations;

    protected string $model = SchoolEvent::class;

    protected array $validationRules = [
        'NameSE' => 'required|string|max:255',
        'DescriptionSE' => 'nullable|string',
        'IsFullDaySE' => 'sometimes|boolean',
        'LocationSE' => 'nullable|string|max:255',
        'DateSE' => 'required|date',
        'MatriculeTS' => 'required|string|exists:time_slots,MatriculeTS',
    ];

    // Define resource name for messages
    protected string $resourceName = 'School Event';

    // Methods provided by CrudOperations trait
}
