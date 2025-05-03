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
        'UserNameUT' => 'required|string|max:255',
        'EmailUT' => 'required|email|max:255|unique:users,EmailUT',
        'PhoneUT' => 'nullable|string|max:20',
        'RoleUT' => 'required|string|in:teacher',
        'PasswordUT' => 'required|string|min:8',
        'StatutUT' => 'required|string|in:active,inactive',
        'NomPL' => 'required|string|max:255',
        'PrenomPL' => 'required|string|max:255',
        'GenrePL' => 'required|string|in:male,female',
        'AdressPL' => 'nullable|string|max:255',
        'VillePL' => 'nullable|string|max:255',
        'CodePostalPL' => 'nullable|string|max:20',
        'PaysPL' => 'nullable|string|max:255',
        'NationalitePL' => 'nullable|string|max:255',
        'LieuNaissancePL' => 'nullable|string|max:255',
        'DateNaissancePL' => 'nullable|date',
        'ObservationPL' => 'nullable|string',
        'ProfileFileNamePL' => 'nullable|string|max:255',
        
        // Professeur validation rules
        'CINPR' => 'required|string|max:255|unique:professeurs,CINPR',
        'CivilitePR' => 'nullable|string|max:255',
        'Phone1PR' => 'nullable|string|max:20',
        'Phone2PR' => 'nullable|string|max:20',
        'DateEmbauchePR' => 'nullable|date',
        'SalairePR' => 'nullable|numeric',
        'NomBanquePR' => 'nullable|string|max:255',
        'RIBPR' => 'nullable|string|max:255',
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
                'UserNameUT' => $validatedData['UserNameUT'],
                'EmailUT' => $validatedData['EmailUT'],
                'PhoneUT' => $validatedData['PhoneUT'],
                'RoleUT' => $validatedData['RoleUT'],
                'PasswordUT' => bcrypt($validatedData['PasswordUT']),
                'StatutUT' => $validatedData['StatutUT'],
                'NomPL' => $validatedData['NomPL'],
                'PrenomPL' => $validatedData['PrenomPL'],
                'GenrePL' => $validatedData['GenrePL'],
                'AdressPL' => $validatedData['AdressPL'],
                'VillePL' => $validatedData['VillePL'],
                'CodePostalPL' => $validatedData['CodePostalPL'],
                'PaysPL' => $validatedData['PaysPL'],
                'NationalitePL' => $validatedData['NationalitePL'],
                'LieuNaissancePL' => $validatedData['LieuNaissancePL'],
                'DateNaissancePL' => $validatedData['DateNaissancePL'],
                'ObservationPL' => $validatedData['ObservationPL'],
                'ProfileFileNamePL' => $validatedData['ProfileFileNamePL'],
            ]);
            $user->save();

            // Create Professeur with user reference
            $professeur = new Professeur([
                'CINPR' => $validatedData['CINPR'],
                'CivilitePR' => $validatedData['CivilitePR'],
                'Phone1PR' => $validatedData['Phone1PR'],
                'Phone2PR' => $validatedData['Phone2PR'],
                'DateEmbauchePR' => $validatedData['DateEmbauchePR'],
                'SalairePR' => $validatedData['SalairePR'],
                'NomBanquePR' => $validatedData['NomBanquePR'],
                'RIBPR' => $validatedData['RIBPR'],
                'MatriculeUT' => $user->MatriculeUT,
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
                ->where('MatriculePR', $matricule)
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
            $professeur = Professeur::where('MatriculePR', $matricule)->firstOrFail();

            // Get the associated User
            $user = User::where('MatriculeUT', $professeur->MatriculeUT)->firstOrFail();

            // Modify validation rules for update
            $rules = $this->validationRules;
            $rules['EmailUT'] = 'required|email|max:255|unique:users,EmailUT,' . $user->MatriculeUT . ',MatriculeUT';
            $rules['CINPR'] = 'required|string|max:255|unique:professeurs,CINPR,' . $professeur->MatriculePR . ',MatriculePR';
            $rules['PasswordUT'] = 'nullable|string|min:8';

            // Validate request data
            $validatedData = $this->validateRequest($request, $rules);

            // Update User
            $userData = array_intersect_key($validatedData, array_flip([
                'UserNameUT', 'EmailUT', 'PhoneUT', 'RoleUT', 'StatutUT',
                'NomPL', 'PrenomPL', 'GenrePL', 'AdressPL', 'VillePL',
                'CodePostalPL', 'PaysPL', 'NationalitePL', 'LieuNaissancePL',
                'DateNaissancePL', 'ObservationPL', 'ProfileFileNamePL'
            ]));
            
            if (!empty($validatedData['PasswordUT'])) {
                $userData['PasswordUT'] = bcrypt($validatedData['PasswordUT']);
            }
            
            $user->update($userData);

            // Update Professeur
            $professeurData = array_intersect_key($validatedData, array_flip([
                'CINPR', 'CivilitePR', 'Phone1PR', 'Phone2PR',
                'DateEmbauchePR', 'SalairePR', 'NomBanquePR', 'RIBPR'
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

            $professeur = Professeur::where('MatriculePR', $matricule)->firstOrFail();
            
            // Delete associated user
            $user = User::where('MatriculeUT', $professeur->MatriculeUT)->first();
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
