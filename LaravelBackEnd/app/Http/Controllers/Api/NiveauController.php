<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Traits\CrudOperations;
use App\Models\Niveau;
use Illuminate\Http\Request;

class NiveauController extends Controller
{
    use CrudOperations;

    protected string $model = Niveau::class;

    protected array $validationRules = [
        'codeNv' => 'required|string|max:255',
        'NomNv' => 'required|string|max:255',
        'parent_matriculeNv' => 'nullable|string|exists:niveaux,matriculeNv',
        'typeNv' => 'required|string|max:255',
        'descriptionNv' => 'nullable|string',
        'statusNv' => 'nullable|string|max:255',
    ];

    // Define resource name for messages
    protected string $resourceName = 'Niveau';

    /**
     * Display a listing of niveaux with related data.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        try {
            $niveaux = $this->model::with(['parent', 'matieres', 'groups'])
                ->withCount(['matieres', 'groups'])
                ->get();

            return $this->successResponse($niveaux);
        } catch (\Exception $e) {
            return $this->handleException($e);
        }
    }

    // Methods provided by CrudOperations trait
}
