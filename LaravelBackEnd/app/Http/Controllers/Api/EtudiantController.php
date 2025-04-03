<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Etudiant;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Exception;

class EtudiantController extends Controller
{
    // Constants for Messages
    private const MESSAGES = [
        'not_found' => 'Étudiant non trouvé',
        'created' => 'Étudiant créé avec succès',
        'updated' => 'Étudiant mis à jour avec succès',
        'deleted' => 'Étudiant supprimé avec succès',
        'invalid_params' => 'Paramètres de pagination invalides'
    ];

    private const VALIDATION_RULES = [
        'PROFILE_PICTUREEt' => 'required|string|max:100',
        'GENREEt' => 'required|string|in:Homme,Femelle',
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
        return $this->response(Etudiant::all());
    }

    public function paginate(Request $request)
    {
        $start = (int) $request->query('start', 0);
        $length = (int) $request->query('length', 10);

        if ($start < 0 || $length <= 0) {
            return $this->response(['error' => self::MESSAGES['invalid_params']], 422);
        }

        $etudiants = Etudiant::skip($start)->take($length)->get();
        return $this->response(['data' => $etudiants, 'total' => Etudiant::count()]);
    }

    public function show($matricule)
    {
        $etudiant = Etudiant::find($matricule);
        return $etudiant ? $this->response($etudiant) : $this->response(['error' => self::MESSAGES['not_found']], 404);
    }

    public function store(Request $request)
    {
        try {
            $validatedData = $request->validate(self::VALIDATION_RULES);
            $etudiant = Etudiant::create($validatedData);
            return $this->response(['message' => self::MESSAGES['created'], 'etudiant' => $etudiant], 201);
        } catch (ValidationException $e) {
            return $this->response(['error' => $e->errors()], 422);
        } catch (Exception $e) {
            return $this->response(['error' => 'Une erreur est survenue'], 500);
        }
    }

    public function update(Request $request, $matricule)
    {
        $etudiant = Etudiant::find($matricule);
        if (!$etudiant) {
            return $this->response(['error' => self::MESSAGES['not_found']], 404);
        }

        try {
            $validatedData = $request->validate(self::VALIDATION_RULES);
            $etudiant->update($validatedData);
            return $this->response(['message' => self::MESSAGES['updated'], 'etudiant' => $etudiant]);
        } catch (ValidationException $e) {
            return $this->response(['error' => $e->errors()], 422);
        } catch (Exception $e) {
            return $this->response(['error' => 'Une erreur est survenue'], 500);
        }
    }

    public function destroy($matricule)
    {
        $etudiant = Etudiant::find($matricule);
        if (!$etudiant) {
            return $this->response(['error' => self::MESSAGES['not_found']], 404);
        }

        $etudiant->delete();
        return $this->response(['message' => self::MESSAGES['deleted']]);
    }

    public function count()
    {
        return $this->response(['count' => Etudiant::count()]);
    }
}
