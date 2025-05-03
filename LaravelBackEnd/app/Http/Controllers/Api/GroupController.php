<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Traits\CrudOperations;
use App\Models\Group;
use Illuminate\Http\Request;

class GroupController extends Controller
{
    use CrudOperations;

    protected string $model = Group::class;

    protected array $validationRules = [
        'NameGP' => 'required|string|max:255',
        'DescriptionGp' => 'nullable|string',
        'StatusGP' => 'nullable|string|max:255',
        'MatriculeNV' => 'required|string|exists:niveaux,MatriculeNV',
    ];

    // Define resource name for messages
    protected string $resourceName = 'Group';

    /**
     * Display a listing of groups with related data.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        try {
            $groups = $this->model::with(['niveau', 'etudiants'])
                ->withCount('etudiants')
                ->get();

            return $this->successResponse($groups);
        } catch (\Exception $e) {
            return $this->handleException($e);
        }
    }

    // Methods provided by CrudOperations trait
}
