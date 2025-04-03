<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Inscription;
use Illuminate\Http\Request;

class InscriptionController extends Controller
{
    public function index()
    {
        $inscriptions = Inscription::with(['etudiant', 'groupe', 'anneeAcademique'])->get();
        return response()->json($inscriptions);
    }

    public function paginate(Request $request)
    {
        $perPage = $request->input('per_page', 10);
        $inscriptions = Inscription::with(['etudiant', 'groupe', 'anneeAcademique'])
            ->paginate($perPage);
        return response()->json($inscriptions);
    }

    public function count()
    {
        $count = Inscription::count();
        return response()->json(['count' => $count]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'matriculeEtudiant' => 'required|exists:etudiants,matriculeEt',
            'matriculeGroupe' => 'required|exists:groupes,matriculeGrp',
            'matriculeAnneeAcademique' => 'required|exists:annees_academiques,matriculeAnnee',
            'dateInscription' => 'required|date',
            'statut' => 'required|in:active,inactive',
        ]);

        $inscription = Inscription::create($validated);
        return response()->json($inscription, 201);
    }

    public function show($id)
    {
        $inscription = Inscription::with(['etudiant', 'groupe', 'anneeAcademique'])->findOrFail($id);
        return response()->json($inscription);
    }

    public function update(Request $request, $id)
    {
        $inscription = Inscription::findOrFail($id);
        
        $validated = $request->validate([
            'matriculeEtudiant' => 'exists:etudiants,matriculeEt',
            'matriculeGroupe' => 'exists:groupes,matriculeGrp',
            'matriculeAnneeAcademique' => 'exists:annees_academiques,matriculeAnnee',
            'dateInscription' => 'date',
            'statut' => 'in:active,inactive',
        ]);

        $inscription->update($validated);
        return response()->json($inscription);
    }

    public function destroy($id)
    {
        $inscription = Inscription::findOrFail($id);
        $inscription->delete();
        return response()->json(null, 204);
    }
} 