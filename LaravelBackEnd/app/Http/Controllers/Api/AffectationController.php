<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Affectation;
use Illuminate\Http\Request;

class AffectationController extends Controller
{
    public function index()
    {
        $affectations = Affectation::with(['professeur', 'groupe', 'matiere'])->get();
        return response()->json($affectations);
    }

    public function paginate(Request $request)
    {
        $perPage = $request->input('per_page', 10);
        $affectations = Affectation::with(['professeur', 'groupe', 'matiere'])
            ->paginate($perPage);
        return response()->json($affectations);
    }

    public function count()
    {
        $count = Affectation::count();
        return response()->json(['count' => $count]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'professeur_id' => 'required|exists:professeurs,id',
            'groupe_id' => 'required|exists:groupes,id',
            'matiere_id' => 'required|exists:matieres,id',
            'annee_academique_id' => 'required|exists:annees_academiques,id',
            'date_debut' => 'required|date',
            'date_fin' => 'nullable|date|after:date_debut',
        ]);

        $affectation = Affectation::create($validated);
        return response()->json($affectation, 201);
    }

    public function show($id)
    {
        $affectation = Affectation::with(['professeur', 'groupe', 'matiere'])->findOrFail($id);
        return response()->json($affectation);
    }

    public function update(Request $request, $id)
    {
        $affectation = Affectation::findOrFail($id);
        
        $validated = $request->validate([
            'professeur_id' => 'exists:professeurs,id',
            'groupe_id' => 'exists:groupes,id',
            'matiere_id' => 'exists:matieres,id',
            'annee_academique_id' => 'exists:annees_academiques,id',
            'date_debut' => 'date',
            'date_fin' => 'nullable|date|after:date_debut',
        ]);

        $affectation->update($validated);
        return response()->json($affectation);
    }

    public function destroy($id)
    {
        $affectation = Affectation::findOrFail($id);
        $affectation->delete();
        return response()->json(null, 204);
    }
} 