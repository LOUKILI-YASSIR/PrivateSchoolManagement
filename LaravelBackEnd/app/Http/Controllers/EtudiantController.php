<?php

namespace App\Http\Controllers;

use App\Models\Etudiant;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class EtudiantController extends Controller
{

    const ETUDIANT_NOT_FOUND = 'Etudiant not found';
    const ETUDIANT_CREATED = 'Etudiant created successfully';
    const ETUDIANT_UPDATED = 'Etudiant updated successfully';
    const ETUDIANT_DELETED = 'Etudiant deleted successfully';

    const VALIDATION_RULES = [
        // Student Information
        'PROFILE_PICTUREEt' => 'required|string|max:100',
        'GENREEt' => 'required|string|in:H,F',
        'NOMEt' => 'required|string|max:50',
        'PRENOMEt' => 'required|string|max:30',
        'LIEU_NAISSANCEEt' => 'required|string|max:100',
        'DATE_NAISSANCEEt' => 'required|date',
        'NATIONALITEEt' => 'required|string|max:60',
        'ADRESSEEt' => 'required|string|max:150',
        'VILLEEt' => 'required|string|max:100',
        'PAYSEt' => 'required|string|max:60',
        'CODE_POSTALEt' => 'required|string|max:10',
        'EMAILEt' => 'required|email|max:100',
        'OBSERVATIONEt' => 'nullable|string',

        // Parent Information
        'LIEN_PARENTETr' => 'required|string|max:20',
        'NOMTr' => 'required|string|max:50',
        'PRENOMTr' => 'required|string|max:30',
        'PROFESSIONTr' => 'required|string|max:100',
        'TELEPHONE1Tr' => 'required|string|max:30',
        'TELEPHONE2Tr' => 'nullable|string|max:30',
        'EMAILTr' => 'required|email|max:100',
        'OBSERVATIONTr' => 'nullable|string',
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
        $etudiants = Etudiant::all();
        return $this->response($etudiants);
    }
    public function paginated($start, $length)
    {
        // Validate parameters
        if (!is_numeric($start) || $start < 0) {
            throw ValidationException::withMessages(['Invalid start parameter']);
        }
        if (!is_numeric($length) || $length <= 0) {
            throw ValidationException::withMessages(['Invalid length parameter']);
        }

        $etudiants = Etudiant::skip((int)$start)
                            ->take((int)$length)
                            ->get();

        $total = Etudiant::count(); // Get total records for frontend pagination

        return $this->response([
            'data' => $etudiants,
            'total' => $total
        ]);
    }
    public function show($matriculeEt)
    {
        $etudiant = Etudiant::where('matriculeEt', $matriculeEt)->first();
        if (!$etudiant) {
            throw ValidationException::withMessages([self::ETUDIANT_NOT_FOUND]);
        }
        return $this->response($etudiant);
    }

    public function store(Request $request)
    {
        $validatedData = $this->validateRequest(request: $request);
        $etudiant = Etudiant::create($validatedData);
        return $this->response(['message' => self::ETUDIANT_CREATED, 'etudiant' => $etudiant], 201);
    }

    public function update(Request $request, $matriculeEt)
    {
        $etudiant = Etudiant::where('matriculeEt', $matriculeEt)->first();
        if (!$etudiant) {
            return response()->json(['error' => 'Étudiant non trouvé'], 404);
        }

        try {
            $validatedData = $this->validateRequest($request);
            $etudiant->update($validatedData);
            return response()->json(['message' => 'Étudiant mis à jour avec succès', 'etudiant' => $etudiant], 200);
        } catch (ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        }
    }
    public function count()
    {
        $count = Etudiant::count();
        return response()->json(['count' => $count]);
    }


    public function destroy($matriculeEt)
    {
        $etudiant = Etudiant::where('matriculeEt', $matriculeEt)->first();
        if (!$etudiant) {
            throw ValidationException::withMessages([self::ETUDIANT_NOT_FOUND]);
        }
        $etudiant->delete();
        return $this->response(['message' => self::ETUDIANT_DELETED]);
    }

    private function validateRequest(Request $request)
    {
        return $request->validate(self::VALIDATION_RULES);
    }
}
