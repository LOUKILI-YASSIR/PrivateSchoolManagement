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
        'UserNameUT' => 'required|string|max:255',
        'EmailUT' => 'required|email|max:255|unique:users,EmailUT',
        'PasswordUT' => 'required|string|min:8',
        'RoleUT' => 'required|string|in:student',
        'ProfileFileNamePL' => 'nullable|string|max:255',

        // Etudiant validation rules
        'EmailET' => 'required|email|max:255|unique:etudiants,EmailET',
        'PhoneET' => 'nullable|string|max:20',
        'LienParenteTR' => 'nullable|string|max:255',
        'ProfessionTR' => 'nullable|string|max:255',
        'NomTR' => 'nullable|string|max:255',
        'PrenomTR' => 'nullable|string|max:255',
        'Phone1TR' => 'nullable|string|max:20',
        'Phone2TR' => 'nullable|string|max:20',
        'EmailTR' => 'nullable|email|max:255',
        'ObservationTR' => 'nullable|string|max:255',
        'MatriculeGP' => 'required|string|exists:groups,MatriculeGP',

        // Person data
        'NomPL' => 'required|string|max:255',
        'PrenomPL' => 'required|string|max:255',
        'GenrePL' => 'nullable|string|max:255',
        'AdressPL' => 'nullable|string|max:255',
        'VillePL' => 'nullable|string|max:255',
        'CodePostalPL' => 'nullable|string|max:10',
        'PaysPL' => 'nullable|string|max:255',
        'NationalitePL' => 'nullable|string|max:255',
        'LieuNaissancePL' => 'nullable|string|max:255',
        'DateNaissancePL' => 'nullable|date',
        'ObservationPL' => 'nullable|string|max:255',
        'StatutUT' => 'nullable|string|max:255',
    ];

    protected static function getMatriculePrefix()
    {
        return 'ET';
    }

    public function store(Request $request): \Illuminate\Http\JsonResponse
    {
        try {
            DB::beginTransaction();

            $validatedData = $this->validateRequest($request, $this->validationRules);

            $user = new User([
                'UserNameUT' => $validatedData['UserNameUT'],
                'EmailUT' => $validatedData['EmailUT'],
                'PhoneUT' => $validatedData['PhoneET'] ?? null,
                'PasswordUT' => bcrypt($validatedData['PasswordUT']),
                'RoleUT' => $validatedData['RoleUT'],
                'ProfileFileNamePL' => $validatedData['ProfileFileNamePL'] ?? null,
                'NomPL' => $validatedData['NomPL'],
                'PrenomPL' => $validatedData['PrenomPL'],
                'GenrePL' => $validatedData['GenrePL'] ?? null,
                'AdressPL' => $validatedData['AdressPL'] ?? null,
                'VillePL' => $validatedData['VillePL'] ?? null,
                'CodePostalPL' => $validatedData['CodePostalPL'] ?? null,
                'PaysPL' => $validatedData['PaysPL'] ?? null,
                'NationalitePL' => $validatedData['NationalitePL'] ?? null,
                'LieuNaissancePL' => $validatedData['LieuNaissancePL'] ?? null,
                'DateNaissancePL' => $validatedData['DateNaissancePL'] ?? null,
                'ObservationPL' => $validatedData['ObservationPL'] ?? null,
                'StatutUT' => $validatedData['StatutUT'] ?? 'offline',
                'CodeVerificationUT' => uniqid('verif_'),
            ]);
            $user->save();

            $etudiant = new Etudiant([
                'EmailET' => $validatedData['EmailET'],
                'PhoneET' => $validatedData['PhoneET'] ?? null,
                'LienParenteTR' => $validatedData['LienParenteTR'] ?? null,
                'ProfessionTR' => $validatedData['ProfessionTR'] ?? null,
                'NomTR' => $validatedData['NomTR'] ?? null,
                'PrenomTR' => $validatedData['PrenomTR'] ?? null,
                'Phone1TR' => $validatedData['Phone1TR'] ?? null,
                'Phone2TR' => $validatedData['Phone2TR'] ?? null,
                'EmailTR' => $validatedData['EmailTR'] ?? null,
                'ObservationTR' => $validatedData['ObservationTR'] ?? null,
                'MatriculeUT' => $user->MatriculeUT,
                'MatriculeGP' => $validatedData['MatriculeGP'],
            ]);
            $etudiant->save();

            DB::commit();
            $etudiant->load('user');

            return $this->successResponse($etudiant, 'created');

        } catch (\Exception $e) {
            DB::rollBack();
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function update(Request $request, $matricule): \Illuminate\Http\JsonResponse
    {
        try {
            DB::beginTransaction();

            $etudiant = Etudiant::where('MatriculeET', $matricule)->first();
            if (!$etudiant) return $this->notFoundResponse($this->getResourceName());

            $user = User::where('MatriculeUT', $etudiant->MatriculeUT)->first();
            if (!$user) return $this->notFoundResponse('User');

            $rules = $this->validationRules;
            $rules['EmailUT'] = 'required|email|max:255|unique:users,EmailUT,' . $user->MatriculeUT . ',MatriculeUT';
            $rules['EmailET'] = 'required|email|max:255|unique:etudiants,EmailET,' . $etudiant->MatriculeET . ',MatriculeET';
            $rules['PasswordUT'] = 'nullable|string|min:8';

            $validatedData = $this->validateRequest($request, $rules);

            $user->update([
                'UserNameUT' => $validatedData['UserNameUT'],
                'EmailUT' => $validatedData['EmailUT'],
                'PhoneUT' => $validatedData['PhoneET'] ?? null,
                'ProfileFileNamePL' => $validatedData['ProfileFileNamePL'] ?? null,
                'NomPL' => $validatedData['NomPL'],
                'PrenomPL' => $validatedData['PrenomPL'],
                'GenrePL' => $validatedData['GenrePL'] ?? null,
                'AdressPL' => $validatedData['AdressPL'] ?? null,
                'VillePL' => $validatedData['VillePL'] ?? null,
                'CodePostalPL' => $validatedData['CodePostalPL'] ?? null,
                'PaysPL' => $validatedData['PaysPL'] ?? null,
                'NationalitePL' => $validatedData['NationalitePL'] ?? null,
                'LieuNaissancePL' => $validatedData['LieuNaissancePL'] ?? null,
                'DateNaissancePL' => $validatedData['DateNaissancePL'] ?? null,
                'ObservationPL' => $validatedData['ObservationPL'] ?? null,
                'StatutUT' => $validatedData['StatutUT'] ?? 'offline',
                'PasswordUT' => !empty($validatedData['PasswordUT']) ? bcrypt($validatedData['PasswordUT']) : $user->PasswordUT,
            ]);

            $etudiant->update([
                'EmailET' => $validatedData['EmailET'],
                'PhoneET' => $validatedData['PhoneET'] ?? null,
                'LienParenteTR' => $validatedData['LienParenteTR'] ?? null,
                'ProfessionTR' => $validatedData['ProfessionTR'] ?? null,
                'NomTR' => $validatedData['NomTR'] ?? null,
                'PrenomTR' => $validatedData['PrenomTR'] ?? null,
                'Phone1TR' => $validatedData['Phone1TR'] ?? null,
                'Phone2TR' => $validatedData['Phone2TR'] ?? null,
                'EmailTR' => $validatedData['EmailTR'] ?? null,
                'ObservationTR' => $validatedData['ObservationTR'] ?? null,
                'MatriculeGP' => $validatedData['MatriculeGP'],
            ]);

            DB::commit();
            $etudiant->load('user');
            return $this->successResponse($etudiant, 'updated');

        } catch (\Exception $e) {
            DB::rollBack();
            return $this->handleException($e);
        }
    }

    public function destroy($matricule): \Illuminate\Http\JsonResponse
    {
        try {
            DB::beginTransaction();

            $etudiant = Etudiant::where('MatriculeET', $matricule)->first();
            if (!$etudiant) return $this->notFoundResponse($this->getResourceName());

            $user = User::where('MatriculeUT', $etudiant->MatriculeUT)->first();
            if ($user) $user->delete();

            $etudiant->delete();

            DB::commit();
            return $this->successResponse(null, 'deleted');

        } catch (\Exception $e) {
            DB::rollBack();
            return $this->handleException($e);
        }
    }

    public function index(): \Illuminate\Http\JsonResponse
    {
        try {
            $records = $this->model::with('user')->get();
            return $this->successResponse([
                'data' => $records,
                'total' => $records->count()
            ]);
        } catch (\Exception $e) {
            return $this->handleException($e);
        }
    }

    public function show($matricule): \Illuminate\Http\JsonResponse
    {
        try {
            $etudiant = $this->model::with('user')->where('MatriculeET', $matricule)->firstOrFail();
            return $this->successResponse($etudiant);
        } catch (\Exception $e) {
            return $this->handleException($e);
        }
    }
}
