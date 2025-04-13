<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Traits\CrudOperations;
use App\Models\NoteFinal;
use Illuminate\Http\Request;

class NoteFinalController extends Controller
{
    use CrudOperations;

    protected string $model = NoteFinal::class;

    protected array $validationRules = [
        'matriculeEt' => 'required|string|exists:etudiants,matriculeEt',
        'gradeNf' => 'required|numeric|min:0',
        'commentaireNf' => 'nullable|string|max:255',
    ];

    // Define resource name for messages
    protected string $resourceName = 'Final Note';

    // Methods provided by CrudOperations trait
}
