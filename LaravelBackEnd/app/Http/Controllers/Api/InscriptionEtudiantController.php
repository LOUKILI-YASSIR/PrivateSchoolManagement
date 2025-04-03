<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\InscriptionEtudiant;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class InscriptionEtudiantController extends Controller
{
    // Constants Errors Messages
    const INSCRIPTION_NOT_FOUND = 'Inscription not found';
    const INSCRIPTION_CREATED = 'Inscription created successfully';
    const INSCRIPTION_UPDATED = 'Inscription updated successfully';
    const INSCRIPTION_DELETED = 'Inscription deleted successfully';
    const INSCRIPTION_INVALID_PAGE_PARAMS = 'Invalid pagination parameters';
    const VALIDATION_RULES = [
        'matriculeEt' => 'required|string|exists:etudiants,matriculeEt',
        'matriculeGrp' => 'required|string|exists:groupes,matriculeGrp',
        'matriculeAnnee' => 'required|string|exists:annees_academiques,matriculeAnnee',
        'dateInscription' => 'required|date',
        'fraisInscription' => 'required|numeric|min:0',
        'fraisAnnuel' => 'required|numeric|min:0',
        'remise' => 'required|numeric|min:0|max:100',
        'montantPaye' => 'required|numeric|min:0',
        'statut' => 'required|string|in:en_cours,validee,annulee'
    ];

    /**
     * إرجاع جميع التسجيلات
     */
    private function response($data, $statusCode = 200)
    {
        return response()->json($data, $statusCode)
            ->header('Access-Control-Allow-Origin', '*')
            ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
            ->header('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization');
    }

    public function index()
    {
        return $this->response(InscriptionEtudiant::with(['etudiant', 'groupe', 'anneeAcademique'])->get());
    }

    /**
     * إرجاع قائمة التسجيلات بطريقة متدرجة (Pagination)
     */
    public function paginated($start, $length)
    {
        $start = (int) $start;
        $length = (int) $length;

        if ($start < 0 || $length <= 0) {
            return $this->response(['error' => self::INSCRIPTION_INVALID_PAGE_PARAMS], 422);
        }

        $inscriptions = InscriptionEtudiant::with(['etudiant', 'groupe', 'anneeAcademique'])
            ->skip($start)
            ->take($length)
            ->get();
        return $this->response(['data' => $inscriptions, 'total' => InscriptionEtudiant::count()]);
    }

    /**
     * إرجاع تسجيل معين بناءً على المعرف
     */
    public function show($matriculeIns)
    {
        $inscription = InscriptionEtudiant::with(['etudiant', 'groupe', 'anneeAcademique'])
            ->where('matriculeIns', $matriculeIns)
            ->first();
        if (!$inscription) {
            return $this->response(['error' => self::INSCRIPTION_NOT_FOUND], 404);
        }
        return $this->response($inscription);
    }

    /**
     * إنشاء تسجيل جديد
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate(self::VALIDATION_RULES);
        $inscription = InscriptionEtudiant::create($validatedData);

        return $this->response([
            'message' => self::INSCRIPTION_CREATED,
            'inscription' => $inscription->load(['etudiant', 'groupe', 'anneeAcademique'])
        ], 201);
    }

    /**
     * تحديث بيانات تسجيل
     */
    public function update(Request $request, $matriculeIns)
    {
        $inscription = InscriptionEtudiant::where('matriculeIns', $matriculeIns)->first();
        if (!$inscription) {
            return $this->response(['error' => self::INSCRIPTION_NOT_FOUND], 404);
        }

        $validatedData = $request->validate(self::VALIDATION_RULES);
        $inscription->update($validatedData);

        return $this->response([
            'message' => self::INSCRIPTION_UPDATED,
            'inscription' => $inscription->load(['etudiant', 'groupe', 'anneeAcademique'])
        ]);
    }

    /**
     * حذف تسجيل معين
     */
    public function destroy($matriculeIns)
    {
        $inscription = InscriptionEtudiant::where('matriculeIns', $matriculeIns)->first();
        if (!$inscription) {
            return $this->response(['error' => self::INSCRIPTION_NOT_FOUND], 404);
        }

        $inscription->delete();
        return $this->response(['message' => self::INSCRIPTION_DELETED]);
    }

    /**
     * حساب عدد التسجيلات
     */
    public function count()
    {
        return $this->response(['count' => InscriptionEtudiant::count()]);
    }
} 