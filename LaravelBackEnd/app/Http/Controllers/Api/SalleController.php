<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Traits\CrudOperations;
use App\Models\Salle;
use Illuminate\Http\Request;

class SalleController extends Controller
{
    use CrudOperations;

    protected string $model = Salle::class;

    protected array $validationRules = [
        'NameSL' => 'required|string|max:255|unique:salles,NameSL',
        'CapacitySL' => 'required|integer|min:1',
        'LocationSL' => 'nullable|string|max:255',
        'RessourcesSL' => 'nullable|string',
        'TypeSL' => 'nullable|string|max:255',
        'StatusSL' => 'required|string|max:255|in:disponible,occupée,réservée,en_maintenance,fermée,en_nettoyage,mode_examen,événement,non_attribuée',
        'FloorSL' => 'nullable|integer',
        'ObservationSL' => 'nullable|string',
        'MatriculeYR' => 'required|exists:academic_years,MatriculeYR',
    ];

    // Define resource name for messages
    protected string $resourceName = 'Salle';
    public function getAllSallesNamesArray() {
        $noms = Salle::pluck('NameSL')->toArray();
        return [
            'noms' => $noms,
        ];
    }
    public function store(Request $request)
{
    // Add MatriculeSL to validation rules
    $rules = $this->validationRules;

    // Validate the request
    $validatedData = $request->validate($rules);

    try {
        // Create a new instance of the model
        $resource = new $this->model($validatedData);
        $resource->save();

        // Return success response
        return response()->json([
            'message' => "{$this->resourceName} created successfully",
            'data' => $resource
        ], 201);
    } catch (\Exception $e) {
        // Handle errors
        return response()->json([
            'message' => "Failed to create {$this->resourceName}",
            'error' => $e->getMessage()
        ], 500);
    }
}
public function update(Request $request, $matriculeSL)
{
    // Adjust unique rule for NameSL to ignore the current record
    $rules = $this->validationRules;
    $rules['NameSL'] = "required|string|max:255|unique:salles,NameSL,{$matriculeSL},MatriculeSL";

    // Validate the request
    $validatedData = $request->validate($rules);

    try {
        // Find the resource by MatriculeSL
        $resource = $this->model::where('MatriculeSL', $matriculeSL)->firstOrFail();

        // Update the resource
        $resource->update($validatedData);

        // Return success response
        return response()->json([
            'message' => "{$this->resourceName} updated successfully",
            'data' => $resource
        ], 200);
    } catch (\Exception $e) {
        // Handle errors
        return response()->json([
            'message' => "Failed to update {$this->resourceName}",
            'error' => $e->getMessage()
        ], 500);
    }
}
public function destroy($matriculeSL)
{
    try {
        // Find the resource by MatriculeSL
        $resource = $this->model::where('MatriculeSL', $matriculeSL)->firstOrFail();

        // Delete the resource
        $resource->delete();

        // Return success response
        return response()->json([
            'message' => "{$this->resourceName} deleted successfully"
        ], 200);
    } catch (\Exception $e) {
        // Handle errors
        return response()->json([
            'message' => "Failed to delete {$this->resourceName}",
            'error' => $e->getMessage()
        ], 500);
    }
}
}
