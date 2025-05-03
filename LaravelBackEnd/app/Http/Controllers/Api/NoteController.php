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
        'MatriculeET' => 'required|string|exists:etudiants,MatriculeET',
        'MatriculeMT' => 'required|string|exists:matieres,MatriculeMT',
        'GradeNT' => 'required|numeric|min:0',
        'CommentaireNT' => 'nullable|string|max:255',
    ];

    // Define resource name for messages
    protected string $resourceName = 'Note';

    // Methods provided by CrudOperations trait
}
