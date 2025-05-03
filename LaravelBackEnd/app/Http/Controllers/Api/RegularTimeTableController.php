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
        'MatriculeDW' => 'required|string|exists:day_weeks,MatriculeDW',
        'MatriculeTS' => 'required|string|exists:time_slots,MatriculeTS',
        'MatriculeGP' => 'required|string|exists:groups,MatriculeGP',
        'MatriculeMT' => 'required|string|exists:matieres,MatriculeMT',
        'MatriculePR' => 'required|string|exists:professeurs,MatriculePR',
        'MatriculeSL' => 'required|string|exists:salles,MatriculeSL',
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
