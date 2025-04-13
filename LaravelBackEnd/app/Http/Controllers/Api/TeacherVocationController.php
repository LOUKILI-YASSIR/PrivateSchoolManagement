<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Traits\CrudOperations;
use App\Models\TeacherVocation;
use Illuminate\Http\Request;

class TeacherVocationController extends Controller
{
    use CrudOperations;

    protected string $model = TeacherVocation::class;

    protected array $validationRules = [
        'matriculePr' => 'required|string|exists:professeurs,matriculePr',
        'startDatetv' => 'required|date',
        'approvedTv' => 'sometimes|boolean',
        'endDatetv' => 'nullable|date|after_or_equal:startDatetv',
    ];

    // Define resource name for messages
    protected string $resourceName = 'Teacher Vocation';

    // Methods provided by CrudOperations trait
}
