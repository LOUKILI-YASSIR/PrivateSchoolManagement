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
        'StatusAT' => 'required|string|max:255',
        'IsJustifAT' => 'sometimes|boolean',
        'JustifAT' => 'nullable|string',
        'DateAT' => 'required|date',
        'MatriculeUT' => 'required|string|exists:users,MatriculeUT',
        'MatriculeET' => 'nullable|string|exists:etudiants,MatriculeET|required_without:MatriculePR',
        'MatriculePR' => 'nullable|string|exists:professeurs,MatriculePR|required_without:MatriculeET',
    ];

    // Define resource name for messages
    protected string $resourceName = 'Attendance';

    // Methods provided by CrudOperations trait
}
