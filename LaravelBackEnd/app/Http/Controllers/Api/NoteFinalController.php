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
        'MatriculeET' => 'required|string|exists:etudiants,MatriculeET',
        'GradeNF' => 'required|numeric|min:0',
        'CommentaireNF' => 'nullable|string|max:255',
    ];

    // Define resource name for messages
    protected string $resourceName = 'Final Note';

    // Methods provided by CrudOperations trait
}
