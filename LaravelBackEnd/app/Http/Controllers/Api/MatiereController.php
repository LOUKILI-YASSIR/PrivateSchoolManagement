<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Matiere;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class MatiereController extends Controller
{
    // Constants for error and success messages
    private const MESSAGES = [
        'not_found' => 'Matiere not found',
        'created' => 'Matiere created successfully',
        'updated' => 'Matiere updated successfully',
        'deleted' => 'Matiere deleted successfully',
        'invalid_page_params' => 'Invalid pagination parameters'
    ];

    // Validation rules for creating and updating matieres
    private const VALIDATION_RULES = [
        'name' => 'sometimes|required|string|max:255',
        'description' => 'nullable|string',
        'coefficient' => 'sometimes|required|integer|min:1|max:10',
        'num_controls' => 'sometimes|required|integer|min:1',
        'has_final_exam' => 'sometimes|required|boolean',
        'has_other_grade' => 'sometimes|required|boolean',
        'has_monitoring_behavior_grade' => 'sometimes|required|boolean',
    ];

    /**
     * Standardize JSON responses with CORS headers
     */
    private function response($data, $statusCode = 200)
    {
        return response()->json($data, $statusCode);
    }

    /**
     * Return all matieres
     */
    public function index()
    {
        return $this->response(Matiere::all());
    }

    /**
     * Return paginated list of matieres using query parameters
     */
    public function paginated(Request $request)
    {
        $start = (int) $request->query('start', 0);
        $length = (int) $request->query('length', 10);

        if ($start < 0 || $length <= 0) {
            return $this->response(['error' => self::MESSAGES['invalid_page_params']], 422);
        }

        return $this->response([
            'data' => Matiere::skip($start)->take($length)->get(),
            'total' => Matiere::count()
        ]);
    }

    /**
     * Show a specific matiere by ID (matriculeMat)
     */
    public function show($matriculeMat)
    {
        $matiere = Matiere::find($matriculeMat);
        return $matiere ? $this->response($matiere) : $this->response(['error' => self::MESSAGES['not_found']], 404);
    }

    /**
     * Create a new matiere
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate(self::VALIDATION_RULES);
        return $this->response([
            'message' => self::MESSAGES['created'],
            'matiere' => Matiere::create($validatedData)
        ], 201);
    }

    /**
     * Update an existing matiere
     */
    public function update(Request $request, $matriculeMat)
    {
        $matiere = Matiere::find($matriculeMat);
        if (!$matiere) {
            return $this->response(['error' => self::MESSAGES['not_found']], 404);
        }

        $validatedData = $request->validate(self::VALIDATION_RULES);
        $matiere->update($validatedData);
        return $this->response([
            'message' => self::MESSAGES['updated'],
            'matiere' => $matiere
        ]);
    }

    /**
     * Delete a matiere
     */
    public function destroy($matriculeMat)
    {
        $matiere = Matiere::find($matriculeMat);
        if (!$matiere) {
            return $this->response(['error' => self::MESSAGES['not_found']], 404);
        }

        $matiere->delete();
        return $this->response(['message' => self::MESSAGES['deleted']]);
    }

    /**
     * Count total matieres
     */
    public function count()
    {
        return $this->response(['count' => Matiere::count()]);
    }
}
