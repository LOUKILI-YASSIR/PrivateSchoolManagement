<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Traits\CrudOperations;
use App\Models\RegularTimeTable;
use Illuminate\Http\Request;

class RegularTimeTableController extends Controller
{
    use CrudOperations;

    protected string $model = RegularTimeTable::class;

    protected array $validationRules = [
        'matriculeDW' => 'required|string|exists:day_weeks,matriculeDW',
        'matriculeTs' => 'required|string|exists:time_slots,matriculeTs',
        'matriculeGp' => 'required|string|exists:groups,matriculeGp',
        'matriculeMt' => 'required|string|exists:matieres,matriculeMt',
        'matriculePr' => 'required|string|exists:professeurs,matriculePr',
        'matriculeSl' => 'required|string|exists:salles,matriculeSl',
        // Add unique composite key validation? (e.g., unique for DW+TS+GP)
    ];

    // Define resource name for messages
    protected string $resourceName = 'Regular Time Table Entry';

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
