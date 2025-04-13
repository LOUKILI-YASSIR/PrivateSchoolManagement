<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Traits\CrudOperations;
use App\Traits\GeneratesMatricule;
use App\Models\Etudiant;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class EtudiantController extends Controller
{
    use CrudOperations, GeneratesMatricule;

    protected string $model = Etudiant::class;

    protected array $validationRules = [
        // User validation rules
        'name' => 'required|string|max:255',
        'email' => 'required|email|max:255|unique:users,email',
        'password' => 'required|string|min:8',
        'role' => 'required|string|in:student',
        'ProfileFileNamePl' => 'nullable|string|max:255',
        
        // Etudiant validation rules
        'emailEt' => 'required|email|max:255|unique:etudiants,emailEt',
        'phoneEt' => 'nullable|string|max:20',
        'lienParenteTr' => 'nullable|string|max:255',
        'professionTr' => 'nullable|string|max:255',
        'NomTr' => 'nullable|string|max:255',
        'PrenomTr' => 'nullable|string|max:255',
        'Phone1Tr' => 'nullable|string|max:20',
        'Phone2Tr' => 'nullable|string|max:20',
        'EmailTr' => 'nullable|email|max:255',
        'ObservationTr' => 'nullable|string|max:255',
        'matriculeGp' => 'required|string|exists:groups,matriculeGp',
    ];

    protected static function getMatriculePrefix()
    {
        return 'ET';
    }

    // Override store method to create both User and Etudiant
    public function store(Request $request): \Illuminate\Http\JsonResponse
    {
        try {
            DB::beginTransaction();

            // Validate request data
            $validatedData = $this->validateRequest($request, $this->validationRules);

            // Create User first with generated matricule
            $user = new User([
                'nameUt' => $validatedData['name'],
                'emailUt' => $validatedData['emailEt'],
                'phoneUt' => $validatedData['phoneEt'],
                'passwordUt' => bcrypt($validatedData['password']),
                'roleUt' => $validatedData['roleUt'],
                'ProfileFileNamePl' => $validatedData['ProfileFileNamePl'],
                'NomPl' => $validatedData['NomEt'],
                'PrenomPl' => $validatedData['PrenomEt'],
                'genrePl' => $validatedData['genreEt'],
                'adressPl' => $validatedData['adressEt'],
                'villePl' => $validatedData['villeEt'],
                'codePostalPl' => $validatedData['codePostalEt'],
                'paysPl' => $validatedData['paysEt'],
                'nationalitePl' => $validatedData['nationaliteEt'],
                'lieuNaissancePl' => $validatedData['lieuNaissanceEt'],
                'dateNaissancePl' => $validatedData['dateNaissanceEt'],
                'ObservationPl' => $validatedData['ObservationEt'],
                'statutUt' => $validatedData['statutUt'],
            ]);
            $user->save(); // This will trigger the GeneratesMatricule trait to create matriculeUt

            // Create Etudiant with user reference
            $etudiant = new Etudiant([
                'emailEt' => $validatedData['emailEt'],
                'phoneEt' => $validatedData['phoneEt'],
                'lienParenteTr' => $validatedData['lienParenteTr'],
                'professionTr' => $validatedData['professionTr'],
                'NomTr' => $validatedData['NomTr'],
                'PrenomTr' => $validatedData['PrenomTr'],
                'Phone1Tr' => $validatedData['Phone1Tr'],
                'Phone2Tr' => $validatedData['Phone2Tr'],
                'EmailTr' => $validatedData['EmailTr'],
                'ObservationTr' => $validatedData['ObservationTr'],
                'matriculeUt' => $user->matriculeUt,
                'matriculeGp' => $validatedData['matriculeGp']
            ]);
            $etudiant->save(); // This will trigger the GeneratesMatricule trait to create matriculeEt

            DB::commit();

            // Load the user relationship and return combined data
            $etudiant->load('user');
            return $this->successResponse($etudiant, 'created');

        } catch (\Exception $e) {
            DB::rollBack();
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    // Override update method to handle both User and Etudiant
    public function update(Request $request, $matricule): \Illuminate\Http\JsonResponse
    {
        try {
            DB::beginTransaction();

            // Find the Etudiant
            $etudiant = Etudiant::where('matriculeEt', $matricule)->first();
            if (!$etudiant) {
                return $this->notFoundResponse($this->getResourceName());
            }

            // Get the associated User
            $user = User::where('matriculeUt', $etudiant->matriculeUt)->first();
            if (!$user) {
                return $this->notFoundResponse('User');
            }

            // Modify validation rules for update
            $rules = $this->validationRules;
            $rules['email'] = 'required|email|max:255|unique:users,email,' . $user->id;
            $rules['emailEt'] = 'required|email|max:255|unique:etudiants,emailEt,' . $etudiant->matriculeEt . ',matriculeEt';
            $rules['password'] = 'nullable|string|min:8';

            // Validate request data
            $validatedData = $this->validateRequest($request, $rules);

            // Update User
            $userData = [
                'nameUt' => $validatedData['name'],
                'emailUt' => $validatedData['emailEt'],
                'phoneUt' => $validatedData['phoneEt'],
                'ProfileFileNamePl' => $validatedData['ProfileFileNamePl'],
                'NomPl' => $validatedData['NomEt'],
                'PrenomPl' => $validatedData['PrenomEt'],
                'genrePl' => $validatedData['genreEt'],
                'adressPl' => $validatedData['adressEt'],
                'villePl' => $validatedData['villeEt'],
                'codePostalPl' => $validatedData['codePostalEt'],
                'paysPl' => $validatedData['paysEt'],
                'nationalitePl' => $validatedData['nationaliteEt'],
                'lieuNaissancePl' => $validatedData['lieuNaissanceEt'],
                'dateNaissancePl' => $validatedData['dateNaissanceEt'],
                'ObservationPl' => $validatedData['ObservationEt'],
                'statutUt' => $validatedData['statutUt'],
            ];
            if (!empty($validatedData['password'])) {
                $userData['passwordUt'] = bcrypt($validatedData['password']);
            }
            $user->update($userData);

            // Update Etudiant
            $etudiant->update([
                'emailEt' => $validatedData['emailEt'],
                'phoneEt' => $validatedData['phoneEt'],
                'lienParenteTr' => $validatedData['lienParenteTr'],
                'professionTr' => $validatedData['professionTr'],
                'NomTr' => $validatedData['NomTr'],
                'PrenomTr' => $validatedData['PrenomTr'],
                'Phone1Tr' => $validatedData['Phone1Tr'],
                'Phone2Tr' => $validatedData['Phone2Tr'],
                'EmailTr' => $validatedData['EmailTr'],
                'ObservationTr' => $validatedData['ObservationTr'],
                'matriculeGp' => $validatedData['matriculeGp']
            ]);

            DB::commit();

            // Load the user relationship and return combined data
            $etudiant->load('user');
            return $this->successResponse($etudiant, 'updated');

        } catch (\Exception $e) {
            DB::rollBack();
            return $this->handleException($e);
        }
    }

    // Override destroy method to delete both User and Etudiant
    public function destroy($matricule): \Illuminate\Http\JsonResponse
    {
        try {
            DB::beginTransaction();

            $etudiant = Etudiant::where('matriculeEt', $matricule)->first();
            if (!$etudiant) {
                return $this->notFoundResponse($this->getResourceName());
            }

            // Delete associated user
            $user = User::where('matriculeUt', $etudiant->matriculeUt)->first();
            if ($user) {
                $user->delete();
            }

            // Delete etudiant
            $etudiant->delete();

            DB::commit();
            return $this->successResponse(null, 'deleted');

        } catch (\Exception $e) {
            DB::rollBack();
            return $this->handleException($e);
        }
    }

    // Override index method to include user data
    public function index(): \Illuminate\Http\JsonResponse
    {
        try {
            $records = $this->model::with('user')->get();
            $total = $this->model::count();
            return $this->successResponse([
                'data' => $records,
                'total' => $total
            ]);
        } catch (\Exception $e) {
            return $this->handleException($e);
        }
    }

    // Override show method to include user data
    public function show($matricule): \Illuminate\Http\JsonResponse
    {
        try {
            $etudiant = $this->model::with('user')->where('matriculeEt', $matricule)->firstOrFail();
            return $this->successResponse($etudiant);
        } catch (\Exception $e) {
            return $this->handleException($e);
        }
    }
}
