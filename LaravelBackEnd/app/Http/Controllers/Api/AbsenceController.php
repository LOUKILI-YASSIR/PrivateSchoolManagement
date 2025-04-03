<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Absence;
use Illuminate\Http\Request;

class AbsenceController extends Controller
{
    public function index()
    {
        $absences = Absence::with(['etudiant', 'matiere', 'professeur'])->get();
        return response()->json($absences);
    }

    public function paginate(Request $request)
    {
        $perPage = $request->input('per_page', 10);
        $absences = Absence::with(['etudiant', 'matiere', 'professeur'])
            ->paginate($perPage);
        return response()->json($absences);
    }

    public function count()
    {
        $count = Absence::count();
        return response()->json(['count' => $count]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'etudiant_id' => 'required|exists:etudiants,id',
            'matiere_id' => 'required|exists:matieres,id',
            'professeur_id' => 'required|exists:professeurs,id',
            'date_absence' => 'required|date',
            'justifiee' => 'boolean',
            'commentaire' => 'nullable|string',
        ]);

        $absence = Absence::create($validated);
        return response()->json($absence, 201);
    }

    public function show($id)
    {
        $absence = Absence::with(['etudiant', 'matiere', 'professeur'])->findOrFail($id);
        return response()->json($absence);
    }

    public function update(Request $request, $id)
    {
        $absence = Absence::findOrFail($id);
        
        $validated = $request->validate([
            'etudiant_id' => 'exists:etudiants,id',
            'matiere_id' => 'exists:matieres,id',
            'professeur_id' => 'exists:professeurs,id',
            'date_absence' => 'date',
            'justifiee' => 'boolean',
            'commentaire' => 'nullable|string',
        ]);

        $absence->update($validated);
        return response()->json($absence);
    }

    public function destroy($id)
    {
        $absence = Absence::findOrFail($id);
        $absence->delete();
        return response()->json(null, 204);
    }
} 