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

    public function index()
    {
        try {
            $records = $this->getModelClass()::with(['regularTimeTables'])->get();
            return $this->successResponse($records, 'retrieved');
        } catch (\Exception $e) {
            return $this->handleException($e);
        }
    }

    protected array $validationRules = [
        'NameSL' => 'required|string|max:255',
        'CapacitySL' => 'required|integer|min:0',
        'LocationSL' => 'nullable|string|max:255',
        'RessourcesSL' => 'nullable|string',
        'TypeSL' => 'nullable|string|max:255',
        'StatusSL' => 'nullable|string|max:255',
        'FloorSL' => 'nullable|string|max:255',
        'ObservationSL' => 'nullable|string',
    ];

    // Define resource name for messages
    protected string $resourceName = 'Salle';

    // Methods provided by CrudOperations trait
}
