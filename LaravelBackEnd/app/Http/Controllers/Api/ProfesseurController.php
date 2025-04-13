<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Traits\CrudOperations;
use App\Traits\GeneratesMatricule;
use App\Models\Professeur;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProfesseurController extends Controller
{
    use CrudOperations, GeneratesMatricule;

    protected string $model = Professeur::class;

    protected array $validationRules = [
        // User validation rules
        'usernameUt' => 'required|string|max:255',
        'emailUt' => 'required|email|max:255|unique:users,emailUt',
        'phoneUt' => 'nullable|string|max:20',
        'roleUt' => 'required|string|in:teacher',
        'passwordUt' => 'required|string|min:8',
        'statutUt' => 'required|string|in:active,inactive',
        'NomPl' => 'required|string|max:255',
        'PrenomPl' => 'required|string|max:255',
        'genrePl' => 'required|string|in:male,female',
        'adressPl' => 'nullable|string|max:255',
        'villePl' => 'nullable|string|max:255',
        'codePostalPl' => 'nullable|string|max:20',
        'paysPl' => 'nullable|string|max:255',
        'nationalitePl' => 'nullable|string|max:255',
        'lieuNaissancePl' => 'nullable|string|max:255',
        'dateNaissancePl' => 'nullable|date',
        'ObservationPl' => 'nullable|string',
        'profileFileNamePl' => 'nullable|string|max:255',
        
        // Professeur validation rules
        'CINPr' => 'required|string|max:255|unique:professeurs,CINPr',
        'civilitePr' => 'nullable|string|max:255',
        'Phone1Pr' => 'nullable|string|max:20',
        'Phone2Pr' => 'nullable|string|max:20',
        'DateEmbauchePr' => 'nullable|date',
        'SalairePr' => 'nullable|numeric',
        'NomBanquePr' => 'nullable|string|max:255',
        'RIBPr' => 'nullable|string|max:255',
    ];

    protected static function getMatriculePrefix()
    {
        return 'PR';
    }

    public function index(): \Illuminate\Http\JsonResponse
    {
        try {
            $professeurs = $this->model::with('user')->get();
            return $this->successResponse($professeurs);
        } catch (\Exception $e) {
            return $this->handleException($e);
        }
    }

    public function store(Request $request): \Illuminate\Http\JsonResponse
    {
        try {
            DB::beginTransaction();

            // Validate request data
            $validatedData = $this->validateRequest($request, $this->validationRules);

            // Create User first
            $user = new User([
                'usernameUt' => $validatedData['usernameUt'],
                'emailUt' => $validatedData['emailUt'],
                'phoneUt' => $validatedData['phoneUt'],
                'roleUt' => $validatedData['roleUt'],
                'passwordUt' => bcrypt($validatedData['passwordUt']),
                'statutUt' => $validatedData['statutUt'],
                'NomPl' => $validatedData['NomPl'],
                'PrenomPl' => $validatedData['PrenomPl'],
                'genrePl' => $validatedData['genrePl'],
                'adressPl' => $validatedData['adressPl'],
                'villePl' => $validatedData['villePl'],
                'codePostalPl' => $validatedData['codePostalPl'],
                'paysPl' => $validatedData['paysPl'],
                'nationalitePl' => $validatedData['nationalitePl'],
                'lieuNaissancePl' => $validatedData['lieuNaissancePl'],
                'dateNaissancePl' => $validatedData['dateNaissancePl'],
                'ObservationPl' => $validatedData['ObservationPl'],
                'profileFileNamePl' => $validatedData['profileFileNamePl'],
            ]);
            $user->save();

            // Create Professeur with user reference
            $professeur = new Professeur([
                'CINPr' => $validatedData['CINPr'],
                'civilitePr' => $validatedData['civilitePr'],
                'Phone1Pr' => $validatedData['Phone1Pr'],
                'Phone2Pr' => $validatedData['Phone2Pr'],
                'DateEmbauchePr' => $validatedData['DateEmbauchePr'],
                'SalairePr' => $validatedData['SalairePr'],
                'NomBanquePr' => $validatedData['NomBanquePr'],
                'RIBPr' => $validatedData['RIBPr'],
                'matriculeUt' => $user->matriculeUt,
            ]);
            $professeur->save();

            DB::commit();

            // Load the user relationship and return combined data
            $professeur->load('user');
            return $this->successResponse($professeur, 'created');

        } catch (\Exception $e) {
            DB::rollBack();
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function show($matricule): \Illuminate\Http\JsonResponse
    {
        try {
            $professeur = $this->model::with(['user', 'matieres', 'attendances', 'teacherVocations', 'regularTimeTables'])
                ->where('matriculePr', $matricule)
                ->firstOrFail();
            return $this->successResponse($professeur);
        } catch (\Exception $e) {
            return $this->handleException($e);
        }
    }

    public function update(Request $request, $matricule): \Illuminate\Http\JsonResponse
    {
        try {
            DB::beginTransaction();

            // Find the Professeur
            $professeur = Professeur::where('matriculePr', $matricule)->firstOrFail();

            // Get the associated User
            $user = User::where('matriculeUt', $professeur->matriculeUt)->firstOrFail();

            // Modify validation rules for update
            $rules = $this->validationRules;
            $rules['emailUt'] = 'required|email|max:255|unique:users,emailUt,' . $user->matriculeUt . ',matriculeUt';
            $rules['CINPr'] = 'required|string|max:255|unique:professeurs,CINPr,' . $professeur->matriculePr . ',matriculePr';
            $rules['passwordUt'] = 'nullable|string|min:8';

            // Validate request data
            $validatedData = $this->validateRequest($request, $rules);

            // Update User
            $userData = array_intersect_key($validatedData, array_flip([
                'usernameUt', 'emailUt', 'phoneUt', 'roleUt', 'statutUt',
                'NomPl', 'PrenomPl', 'genrePl', 'adressPl', 'villePl',
                'codePostalPl', 'paysPl', 'nationalitePl', 'lieuNaissancePl',
                'dateNaissancePl', 'ObservationPl', 'profileFileNamePl'
            ]));
            
            if (!empty($validatedData['passwordUt'])) {
                $userData['passwordUt'] = bcrypt($validatedData['passwordUt']);
            }
            
            $user->update($userData);

            // Update Professeur
            $professeurData = array_intersect_key($validatedData, array_flip([
                'CINPr', 'civilitePr', 'Phone1Pr', 'Phone2Pr',
                'DateEmbauchePr', 'SalairePr', 'NomBanquePr', 'RIBPr'
            ]));
            
            $professeur->update($professeurData);

            DB::commit();

            // Load relationships and return updated data
            $professeur->load(['user', 'matieres', 'attendances', 'teacherVocations', 'regularTimeTables']);
            return $this->successResponse($professeur, 'updated');

        } catch (\Exception $e) {
            DB::rollBack();
            return $this->handleException($e);
        }
    }

    public function destroy($matricule): \Illuminate\Http\JsonResponse
    {
        try {
            DB::beginTransaction();

            $professeur = Professeur::where('matriculePr', $matricule)->firstOrFail();
            
            // Delete associated user
            $user = User::where('matriculeUt', $professeur->matriculeUt)->first();
            if ($user) {
                $user->delete();
            }

            // Delete the professeur (might be redundant due to cascade, but keeping for safety)
            $professeur->delete();

            DB::commit();
            return $this->successResponse(null, 'deleted');

        } catch (\Exception $e) {
            DB::rollBack();
            return $this->handleException($e);
        }
    }
}
