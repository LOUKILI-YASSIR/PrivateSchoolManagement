<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\EmploiDuTemps;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Exception;

/**
 * EmploiDuTemps Controller
 * 
 * Handles all operations related to school schedules including:
 * - CRUD operations for schedule records
 * - Schedule queries by teacher and class
 * - Schedule statistics and reporting
 */
class EmploiDuTempsController extends Controller
{
    /**
     * Default number of items per page for pagination
     */
    private const DEFAULT_PAGINATION_LIMIT = 10;

    /**
     * Validation rules for EmploiDuTemps model
     */
    private const VALIDATION_RULES = [
        'matriculeClasse' => 'required|string|exists:classes,matriculeClasse',
        'matriculeMat' => 'required|string|exists:matieres,matriculeMat',
        'matriculeProf' => 'required|string|exists:professeurs,matriculeProf',
        'matriculeSalle' => 'required|string|exists:salles,matriculeSalle',
        'matriculeAnnee' => 'required|string|exists:annees_academiques,matriculeAnnee',
        'jour' => 'required|integer|between:1,6',
        'heureDebut' => 'required|date_format:H:i',
        'heureFin' => 'required|date_format:H:i|after:heureDebut'
    ];

    /**
     * Get all schedule records
     *
     * @return JsonResponse The response containing all schedule records
     */
    public function index(): JsonResponse
    {
        try {
            $emplois = EmploiDuTemps::with(['classe', 'matiere', 'professeur', 'salle', 'anneeAcademique'])->get();
            return $this->successResponse($emplois, 'retrieved');
        } catch (Exception $e) {
            return $this->handleException($e);
        }
    }

    /**
     * Get paginated list of schedule records
     *
     * @param Request $request The request containing pagination parameters
     * @return JsonResponse The response containing paginated schedule records
     */
    public function paginate(Request $request): JsonResponse
    {
        try {
            $pagination = $this->handlePagination($request, self::DEFAULT_PAGINATION_LIMIT);
            
            $emplois = EmploiDuTemps::with(['classe', 'matiere', 'professeur', 'salle', 'anneeAcademique'])
                ->paginate(
                    $pagination['per_page'],
                    ['*'],
                    'page',
                    $pagination['page']
                );
                
            return $this->successResponse([
                'data' => $emplois->items(),
                'total' => $emplois->total(),
                'current_page' => $emplois->currentPage(),
                'per_page' => $emplois->perPage()
            ], 'retrieved');
        } catch (Exception $e) {
            return $this->handleException($e);
        }
    }

    /**
     * Get a specific schedule record
     *
     * @param string $matricule The matricule of the schedule record to retrieve
     * @return JsonResponse The response containing the schedule record
     */
    public function show(string $matricule): JsonResponse
    {
        try {
            $emploi = EmploiDuTemps::with(['classe', 'matiere', 'professeur', 'salle', 'anneeAcademique'])
                ->where('matriculeEmploi', $matricule)
                ->firstOrFail();
                
            return $this->successResponse($emploi, 'retrieved');
        } catch (Exception $e) {
            return $this->notFoundResponse('schedule');
        }
    }

    /**
     * Create a new schedule record
     *
     * @param Request $request The request containing the schedule record data
     * @return JsonResponse The response containing the created schedule record
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validatedData = $this->validateRequest($request, self::VALIDATION_RULES);
            $emploi = EmploiDuTemps::create($validatedData);
            return $this->successResponse($emploi, 'created', 201);
        } catch (Exception $e) {
            return $this->handleException($e);
        }
    }

    /**
     * Update a schedule record
     *
     * @param Request $request The request containing the updated schedule record data
     * @param string $matricule The matricule of the schedule record to update
     * @return JsonResponse The response containing the updated schedule record
     */
    public function update(Request $request, string $matricule): JsonResponse
    {
        try {
            $emploi = EmploiDuTemps::where('matriculeEmploi', $matricule)->firstOrFail();
            $validatedData = $this->validateRequest($request, self::VALIDATION_RULES);
            $emploi->update($validatedData);
            return $this->successResponse($emploi, 'updated');
        } catch (Exception $e) {
            return $this->notFoundResponse('schedule');
        }
    }

    /**
     * Delete a schedule record
     *
     * @param string $matricule The matricule of the schedule record to delete
     * @return JsonResponse The response indicating the success of the deletion
     */
    public function destroy(string $matricule): JsonResponse
    {
        try {
            $emploi = EmploiDuTemps::where('matriculeEmploi', $matricule)->firstOrFail();
            $emploi->delete();
            return $this->successResponse(null, 'deleted');
        } catch (Exception $e) {
            return $this->notFoundResponse('schedule');
        }
    }

    /**
     * Get the total count of schedule records
     *
     * @return JsonResponse The response containing the count of schedule records
     */
    public function count(): JsonResponse
    {
        try {
            $count = EmploiDuTemps::count();
            return $this->successResponse(['count' => $count], 'retrieved');
        } catch (Exception $e) {
            return $this->handleException($e);
        }
    }

    /**
     * Get schedule records for a specific teacher
     *
     * @param string $matriculeProf The teacher's matricule
     * @return JsonResponse The response containing the teacher's schedule records
     */
    public function byTeacher(string $matriculeProf): JsonResponse
    {
        try {
            $emplois = EmploiDuTemps::with(['classe', 'matiere', 'salle', 'anneeAcademique'])
                ->where('matriculeProf', $matriculeProf)
                ->get();
                
            return $this->successResponse($emplois, 'retrieved');
        } catch (Exception $e) {
            return $this->handleException($e);
        }
    }

    /**
     * Get schedule records for a specific class
     *
     * @param string $matriculeClasse The class's matricule
     * @return JsonResponse The response containing the class's schedule records
     */
    public function byClass(string $matriculeClasse): JsonResponse
    {
        try {
            $emplois = EmploiDuTemps::with(['matiere', 'professeur', 'salle', 'anneeAcademique'])
                ->where('matriculeClasse', $matriculeClasse)
                ->get();
                
            return $this->successResponse($emplois, 'retrieved');
        } catch (Exception $e) {
            return $this->handleException($e);
        }
    }
} 