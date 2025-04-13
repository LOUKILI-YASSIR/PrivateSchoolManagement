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
        'NameSl' => 'required|string|max:255',
        'CapacitySl' => 'required|integer|min:0',
        'LocationSl' => 'nullable|string|max:255',
        'ressourcesSl' => 'nullable|string',
        'typeSl' => 'nullable|string|max:255',
        'statusSl' => 'nullable|string|max:255',
        'floorSl' => 'nullable|string|max:255',
        'observationSl' => 'nullable|string',
    ];

    // Define resource name for messages
    protected string $resourceName = 'Salle';

    // Methods provided by CrudOperations trait
}
