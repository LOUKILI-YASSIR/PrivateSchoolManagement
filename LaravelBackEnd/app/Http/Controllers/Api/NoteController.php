<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Traits\CrudOperations;
use App\Models\Note;
use Illuminate\Http\Request;

class NoteController extends Controller
{
    use CrudOperations;

    protected string $model = Note::class;

    protected array $validationRules = [
        'matriculeEt' => 'required|string|exists:etudiants,matriculeEt',
        'matriculeMt' => 'required|string|exists:matieres,matriculeMt',
        'gradeNt' => 'required|numeric|min:0',
        'commentaireNt' => 'nullable|string|max:255',
    ];

    // Define resource name for messages
    protected string $resourceName = 'Note';

    // Methods provided by CrudOperations trait
}
