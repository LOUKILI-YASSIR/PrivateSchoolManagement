<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Traits\CrudOperations;
use App\Models\Matiere;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Exception;

class MatiereController extends Controller
{
    use CrudOperations;

    protected string $model = Matiere::class;

    protected array $validationRules = [
        'NameMT' => 'required|string|max:255',
        'CodeMT' => 'required|string|max:255',
        'DescriptionMT' => 'nullable|string|max:255',
        'CoefficientMT' => 'nullable|numeric',
        'MatriculeNV' => 'required|string|exists:niveaux,MatriculeNV',
        'MatriculePR' => 'required|string|exists:professeurs,MatriculePR',
    ];

    /**
     * Display a listing of the resource with related data.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(): JsonResponse
    {
        try {
            $records = $this->getModelClass()::with([
                'niveau:MatriculeNV,NomNV',
                'professeur.user:MatriculeUT,NomPL,PrenomPL',
                'evaluations'
            ])->get();

            return $this->successResponse($records, 'retrieved');
        } catch (Exception $e) {
            return $this->handleException($e);
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    // store() provided by CrudOperations trait

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Matiere  $matiere
     * @return \Illuminate\Http\Response
     */
    // show() provided by CrudOperations trait

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Matiere  $matiere
     * @return \Illuminate\Http\Response
     */
    // update() provided by CrudOperations trait

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Matiere  $matiere
     * @return \Illuminate\Http\Response
     */
    // destroy() provided by CrudOperations trait
}
