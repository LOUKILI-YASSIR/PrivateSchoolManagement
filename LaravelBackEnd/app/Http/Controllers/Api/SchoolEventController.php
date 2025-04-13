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
        'nameSe' => 'required|string|max:255',
        'descriptionSe' => 'nullable|string',
        'isFulldaySe' => 'sometimes|boolean',
        'locationSe' => 'nullable|string|max:255',
        'dateSe' => 'required|date',
        'matriculeTs' => 'required|string|exists:time_slots,matriculeTs',
    ];

    // Define resource name for messages
    protected string $resourceName = 'School Event';

    // Methods provided by CrudOperations trait
}
