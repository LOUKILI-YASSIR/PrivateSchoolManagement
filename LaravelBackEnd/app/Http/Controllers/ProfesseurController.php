<?php

namespace App\Http\Controllers;

use App\Models\Professeur;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class ProfesseurController extends Controller
{
    const PROFESSEUR_NOT_FOUND = 'Professeur not found';
    const PROFESSEUR_CREATED = 'Professeur created successfully';
    const PROFESSEUR_UPDATED = 'Professeur updated successfully';
    const PROFESSEUR_DELETED = 'Professeur deleted successfully';

    const VALIDATION_RULES = [
        'matriculePr' => 'required|string|max:20|unique:professeurs,matriculePr',
        'image_urlPr' => 'nullable|url|max:2083',
        'civilitePr' => 'required|string|max:4',
        'nomPr' => 'required|string|max:50',
        'prenomPr' => 'required|string|max:30',
        'nationalitePr' => 'nullable|string|max:60',
        'CINPr' => 'nullable|string|max:20',
        'DateNaissancePr' => 'required|date',
        'adressePr' => 'nullable|string|max:150',
        'villePr' => 'nullable|string|max:100',
        'CodePostalPr' => 'nullable|integer|digits_between:4,5',
        'paysPr' => 'nullable|string|max:60',
        'emailPr' => 'required|email|unique:professeurs,EMAILTr|max:100',
        'Telephone1Pr' => 'nullable|string|max:15',
        'Telephone2Pr' => 'nullable|string|max:15',
        'dateEmbauchePr' => 'required|date',
        'salairePr' => 'required|numeric|min:0',
        'NomBanquePr' => 'nullable|string|max:100',
        'RIBPr' => 'nullable|string|max:34',
        'observationPr' => 'nullable|string',
    ];

    private function response($data, $statusCode = 200)
    {
        return response()->json($data, $statusCode)
            ->header('Access-Control-Allow-Origin', '*')
            ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
            ->header('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization');
    }

    public function index()
    {
        $professeurs = Professeur::all();
        return $this->response($professeurs);
    }

    public function show($matriculePr)
    {
        $professeur = Professeur::where('matriculePr', $matriculePr)->first();
        if (!$professeur) {
            throw ValidationException::withMessages([self::PROFESSEUR_NOT_FOUND]);
        }
        return $this->response($professeur);
    }

    public function store(Request $request)
    {
        $validatedData = $this->validateRequest($request);
        $professeur = Professeur::create($validatedData);
        return $this->response(['message' => self::PROFESSEUR_CREATED, 'professeur' => $professeur], 201);
    }

    public function update(Request $request, $matriculePr)
    {
        $professeur = Professeur::where('matriculePr', $matriculePr)->first();
        if (!$professeur) {
            throw ValidationException::withMessages([self::PROFESSEUR_NOT_FOUND]);
        }
        $validatedData = $this->validateRequest($request);
        $professeur->update($validatedData);
        return $this->response(['message' => self::PROFESSEUR_UPDATED, 'professeur' => $professeur]);
    }

    public function count()
    {
        $count = Professeur::count();
        return response()->json(['count' => $count]);
    }


    public function destroy($matriculePr)
    {
        $professeur = Professeur::where('matriculePr', $matriculePr)->first();
        if (!$professeur) {
            throw ValidationException::withMessages([self::PROFESSEUR_NOT_FOUND]);
        }
        $professeur->delete();
        return $this->response(['message' => self::PROFESSEUR_DELETED]);
    }

    private function validateRequest(Request $request)
    {
        return $request->validate(self::VALIDATION_RULES);
    }
}
