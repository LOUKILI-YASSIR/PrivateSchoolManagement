<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Evaluation;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class EvaluationController extends Controller
{
    // Messages for responses
    private const MESSAGES = [
        'not_found' => 'Evaluation not found',
        'created' => 'Evaluation created successfully',
        'updated' => 'Evaluation updated successfully',
        'deleted' => 'Evaluation deleted successfully',
        'invalid_page_params' => 'Invalid pagination parameters'
    ];

    // Validation rules
    private const VALIDATION_RULES = [
        'matriculeEvl' => 'sometimes|string|unique:evaluations,matriculeEvl',
        'matriculeEt' => 'required|string|exists:etudiants,matriculeEt',
        'matriculeMat' => 'required|string|exists:matieres,matriculeMat',
        'matriculeAnnee' => 'required|string|exists:annees_academiques,matriculeAnnee',
        'typeEvaluation' => 'required|string|in:exam,final,transition,result',
        'max_grade' => 'required|numeric|min:0|max:20',
        'percentage' => 'nullable|numeric|min:0|max:100',
        'extraPar' => 'required|string|in:admin,professeur'
    ];

    /**
     * Standardize JSON responses
     */
    private function response($data, $statusCode = 200)
    {
        return response()->json($data, $statusCode);
    }

    /**
     * Get all evaluations
     */
    public function index()
    {
        return $this->response(Evaluation::all());
    }

    /**
     * Get paginated evaluations
     */
    public function paginated(Request $request)
    {
        $start = (int) $request->query('start', 0);
        $length = (int) $request->query('length', 10);

        if ($start < 0 || $length <= 0) {
            return $this->response(['error' => self::MESSAGES['invalid_page_params']], 422);
        }

        return $this->response([
            'data' => Evaluation::skip($start)->take($length)->get(),
            'total' => Evaluation::count()
        ]);
    }

    /**
     * Show a specific evaluation
     */
    public function show($matriculeEvl)
    {
        try {
            $evaluation = Evaluation::findOrFail($matriculeEvl);
        } catch (ModelNotFoundException $e) {
            return response()->json(['message' => self::MESSAGES["not_found"]], 404);
        }

        return response()->json($evaluation);
    }

    /**
     * Create a new evaluation
     */
    public function store(Request $request)
    {
        try {
            $validatedData = $request->validate(self::VALIDATION_RULES);
            return $this->response([
                'message' => self::MESSAGES['created'],
                'evaluation' => Evaluation::create($validatedData)
            ], 201);
        } catch (ValidationException $e) {
            return $this->response(['error' => $e->errors()], 422);
        } catch (Exception $e) {
            return $this->response(['error' => 'An unexpected error occurred'], 500);
        }
    }

    /**
     * Update an evaluation
     */
    public function update(Request $request, $matriculeEvl)
    {
        $evaluation = Evaluation::findOrFail($matriculeEvl);

        try {
            $validatedData = $request->validate(array_merge(self::VALIDATION_RULES, [
                'matriculeEvl' => 'string|exists:evaluations,matriculeEvl'
            ]));

            $evaluation->update($validatedData);
            return $this->response([
                'message' => self::MESSAGES['updated'],
                'evaluation' => $evaluation
            ]);
        } catch (ValidationException $e) {
            return $this->response(['error' => $e->errors()], 422);
        } catch (Exception $e) {
            return $this->response(['error' => 'An unexpected error occurred'], 500);
        }
    }

    /**
     * Delete an evaluation
     */
    public function destroy($matriculeEvl)
    {
        $evaluation = Evaluation::findOrFail($matriculeEvl);
        $evaluation->delete();
        return $this->response(['message' => self::MESSAGES['deleted']]);
    }

    /**
     * Count total evaluations
     */
    public function count()
    {
        return $this->response(['count' => Evaluation::count()]);
    }
}
