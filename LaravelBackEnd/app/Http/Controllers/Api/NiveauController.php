<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Traits\CrudOperations;
use App\Models\Niveau;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class NiveauController extends Controller
{
    use CrudOperations;

    protected string $model = Niveau::class;

    protected array $validationRules = [
        'CodeNV' => 'required|string|max:255',
        'NomNV' => 'required|string|max:255',
        'DescriptionNV' => 'nullable|string',
        'MatriculeYR' => 'required|string|exists:academic_years,MatriculeYR',
    ];

    protected string $resourceName = 'Niveau';

    /**
     * Display a listing of niveaux with related data.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        try {
            $niveaux = Niveau::withCount(['matieres', 'groups'])
                ->get();
            return $this->successResponse($niveaux);
        } catch (\Exception $e) {
            return $this->handleException($e);
        }
    }

    /**
     * Get all niveau names.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getAllNiveauxNamesArray()
    {
        try {
            $noms = Niveau::pluck('NomNV')->toArray();
            return ['noms' => $noms];
        } catch (\Exception $e) {
            return $this->handleException($e);
        }
    }

    /**
     * Store a newly created niveau.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $validated = $request->validate($this->validationRules);

        try {
            DB::beginTransaction();

            $niveau = Niveau::create([
                'MatriculeNV' => Niveau::generateMatricule(),
                'CodeNV' => $validated['CodeNV'],
                'NomNV' => $validated['NomNV'],
                'DescriptionNV' => $validated['DescriptionNV'],
                'MatriculeYR' => $validated['MatriculeYR'],
            ]);

            DB::commit();
            return $this->successResponse($niveau, 'Niveau ajouté avec succès');
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->handleException($e);
        }
    }

    /**
     * Update an existing niveau.
     *
     * @param \Illuminate\Http\Request $request
     * @param string $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        $validated = $request->validate($this->validationRules);

        try {
            DB::beginTransaction();

            $niveau = Niveau::findOrFail($id);
            $niveau->update([
                'CodeNV' => $validated['CodeNV'],
                'NomNV' => $validated['NomNV'],
                'DescriptionNV' => $validated['DescriptionNV'],
                'MatriculeYR' => $validated['MatriculeYR'],
            ]);

            DB::commit();
            return $this->successResponse($niveau, 'Niveau mis à jour avec succès');
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->handleException($e);
        }
    }

    /**
     * Delete a niveau.
     *
     * @param string $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        try {
            DB::beginTransaction();

            $niveau = Niveau::findOrFail($id);
            $niveau->delete();

            DB::commit();
            return $this->successResponse(null, 'Niveau supprimé avec succès');
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->handleException($e);
        }
    }

    /**
     * Get niveaux for select inputs.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getAllNiveauxSelect()
    {
        try {
            $niveaux = Niveau::all()->map(function ($niveau) {
                return [
                    'MatriculeNV' => $niveau->MatriculeNV,
                    'NameNV' => $niveau->NomNV ?? 'Inconnu',
                ];
            });

            return $this->successResponse([
                'niveaux' => $niveaux,
            ]);
        } catch (\Exception $e) {
            return $this->handleException($e);
        }
    }
}
