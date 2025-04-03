<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AbsenceProfesseur;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class AbsenceProfesseurController extends Controller
{
    const ABSENCE_NOT_FOUND = 'Absence not found';
    const ABSENCE_CREATED = 'Absence created successfully';
    const ABSENCE_UPDATED = 'Absence updated successfully';
    const ABSENCE_DELETED = 'Absence deleted successfully';

    const VALIDATION_RULES = [
        'matriculePR' => 'required|exists:professeurs,matriculePr',
        'matriculeAnnee' => 'required|exists:annees_academiques,matriculeAnnee',
        'dateAbsence' => 'required|date',
        'justifie' => 'required|boolean',
        'commentaire' => 'nullable|string|max:255',
    ];

    private function response($data, $statusCode = 200)
    {
        return response()->json($data, $statusCode);
    }

    /**
     * إرجاع جميع الغيابات
     */
    public function index()
    {
        return $this->response(AbsenceProfesseur::with(['professeur', 'anneeAcademique'])->get());
    }

    /**
     * إرجاع غياب معين
     */
    public function show($matriculeAbs)
    {
        $absence = AbsenceProfesseur::where('matriculeAbs', $matriculeAbs)->with(['professeur', 'anneeAcademique'])->first();
        if (!$absence) {
            return response()->json(['error' => self::ABSENCE_NOT_FOUND], 404);
        }
        return $this->response($absence);
    }

    /**
     * إنشاء غياب جديد
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate(self::VALIDATION_RULES);
        $absence = AbsenceProfesseur::create($validatedData);

        return $this->response(['message' => self::ABSENCE_CREATED, 'absence' => $absence], 201);
    }

    /**
     * تحديث غياب معين
     */
    public function update(Request $request, $matriculeAbs)
    {
        $absence = AbsenceProfesseur::where('matriculeAbs', $matriculeAbs)->first();
        if (!$absence) {
            return response()->json(['error' => self::ABSENCE_NOT_FOUND], 404);
        }

        $validatedData = $request->validate(self::VALIDATION_RULES);
        $absence->update($validatedData);

        return $this->response(['message' => self::ABSENCE_UPDATED, 'absence' => $absence]);
    }

    /**
     * حذف غياب معين
     */
    public function destroy($matriculeAbs)
    {
        $absence = AbsenceProfesseur::where('matriculeAbs', $matriculeAbs)->first();
        if (!$absence) {
            return response()->json(['error' => self::ABSENCE_NOT_FOUND], 404);
        }

        $absence->delete();
        return $this->response(['message' => self::ABSENCE_DELETED]);
    }

    /**
     * حساب عدد الغيابات
     */
    public function count()
    {
        return $this->response(['count' => AbsenceProfesseur::count()]);
    }
}

