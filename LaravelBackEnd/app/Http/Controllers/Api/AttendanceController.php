<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Traits\CrudOperations;
use App\Models\Attendance;
use Illuminate\Http\Request;

class AttendanceController extends Controller
{
    use CrudOperations;

    protected string $model = Attendance::class;

    protected array $validationRules = [
        'statusAt' => 'required|string|max:255',
        'isJustifAt' => 'sometimes|boolean',
        'justifAt' => 'nullable|string',
        'DateAt' => 'required|date',
        'matriculeUt' => 'required|string|exists:users,matriculeUt',
        'matriculeEt' => 'nullable|string|exists:etudiants,matriculeEt|required_without:matriculePr',
        'matriculePr' => 'nullable|string|exists:professeurs,matriculePr|required_without:matriculeEt',
    ];

    // Define resource name for messages
    protected string $resourceName = 'Attendance';

    // Methods provided by CrudOperations trait
}
