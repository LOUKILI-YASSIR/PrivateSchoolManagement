<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AffectationProfesseur;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class AffectationProfesseurController extends Controller
{
    const AFFECTATION_NOT_FOUND = 'Affectation not found';
    const AFFECTATION_CREATED = 'Affectation created successfully';
    const AFFECTATION_UPDATED = 'Affectation updated successfully';
    const AFFECTATION_DELETED = 'Affectation deleted successfully';
    const AFFECTATION_EXISTS = 'This affectation already exists';

    const VALIDATION_RULES = [
        'matriculePR' => 'required|exists:professeurs,matriculePr',
        'matriculeGrp' => 'required|exists:groupes,matriculeGrp',
        'matriculeMat' => 'required|exists:matieres,matriculeMat',
        'matriculeAnnee' => 'required|exists:annees_academiques,matriculeAnnee',
    ];

    private function response($data, $statusCode = 200)
    {
        return response()->json($data, $statusCode);
    }

    /**
     * إرجاع جميع التخصيصات
     */
    public function index()
    {
        return $this->response(AffectationProfesseur::with(['professeur', 'groupe', 'matiere', 'anneeAcademique'])->get());
    }

    /**
     * إرجاع تخصيص معين
     */
    public function show($matriculeAffect)
    {
        $affectation = AffectationProfesseur::where('matriculeAffect', $matriculeAffect)->with(['professeur', 'groupe', 'matiere', 'anneeAcademique'])->first();
        if (!$affectation) {
            return response()->json(['error' => self::AFFECTATION_NOT_FOUND], 404);
        }
        return $this->response($affectation);
    }

    /**
     * إنشاء تخصيص جديد
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate(self::VALIDATION_RULES);

        // التأكد من عدم وجود تخصيص مكرر
        $exists = AffectationProfesseur::where([
            ['matriculePR', $validatedData['matriculePR']],
            ['matriculeGrp', $validatedData['matriculeGrp']],
            ['matriculeMat', $validatedData['matriculeMat']],
            ['matriculeAnnee', $validatedData['matriculeAnnee']],
        ])->exists();

        if ($exists) {
            return response()->json(['error' => self::AFFECTATION_EXISTS], 409);
        }

        $affectation = AffectationProfesseur::create($validatedData);

        return $this->response(['message' => self::AFFECTATION_CREATED, 'affectation' => $affectation], 201);
    }

    /**
     * تحديث تخصيص معين
     */
    public function update(Request $request, $matriculeAffect)
    {
        $affectation = AffectationProfesseur::where('matriculeAffect', $matriculeAffect)->first();
        if (!$affectation) {
            return response()->json(['error' => self::AFFECTATION_NOT_FOUND], 404);
        }

        $validatedData = $request->validate(self::VALIDATION_RULES);

        // التأكد من عدم وجود تخصيص مكرر
        $exists = AffectationProfesseur::where([
            ['matriculePR', $validatedData['matriculePR']],
            ['matriculeGrp', $validatedData['matriculeGrp']],
            ['matriculeMat', $validatedData['matriculeMat']],
            ['matriculeAnnee', $validatedData['matriculeAnnee']],
        ])->where('matriculeAffect', '!=', $matriculeAffect)->exists();

        if ($exists) {
            return response()->json(['error' => self::AFFECTATION_EXISTS], 409);
        }

        $affectation->update($validatedData);

        return $this->response(['message' => self::AFFECTATION_UPDATED, 'affectation' => $affectation]);
    }

    /**
     * حذف تخصيص معين
     */
    public function destroy($matriculeAffect)
    {
        $affectation = AffectationProfesseur::where('matriculeAffect', $matriculeAffect)->first();
        if (!$affectation) {
            return response()->json(['error' => self::AFFECTATION_NOT_FOUND], 404);
        }

        $affectation->delete();
        return $this->response(['message' => self::AFFECTATION_DELETED]);
    }

    /**
     * حساب عدد التخصيصات
     */
    public function count()
    {
        return $this->response(['count' => AffectationProfesseur::count()]);
    }
}
