<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AbsenceEtudiant;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class AbsenceEtudiantController extends Controller
{
    const ABSENCE_NOT_FOUND = 'Absence not found';
    const ABSENCE_CREATED = 'Absence created successfully';
    const ABSENCE_UPDATED = 'Absence updated successfully';
    const ABSENCE_DELETED = 'Absence deleted successfully';

    const VALIDATION_RULES = [
        'matriculeEt' => 'required|exists:etudiants,matriculeEt',
        'matriculeAnnee' => 'required|exists:annees_academiques,matriculeAnnee',
        'dateAbsence' => 'required|date',
        'motif' => 'nullable|string|max:255',
        'estJustifie' => 'required|boolean',
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
        return $this->response(AbsenceEtudiant::with(['etudiant', 'anneeAcademique'])->get());
    }

    /**
     * إرجاع الغيابات بطريقة متدرجة
     */
    public function paginated($start, $length)
    {
        $start = (int) $start;
        $length = (int) $length;

        if ($start < 0 || $length <= 0) {
            return response()->json(['error' => 'Invalid pagination parameters'], 422);
        }

        return $this->response([
            'data' => AbsenceEtudiant::skip($start)->take($length)->get(),
            'total' => AbsenceEtudiant::count(),
        ]);
    }

    /**
     * إرجاع غياب معين
     */
    public function show($matriculeAbsEt)
    {
        $absence = AbsenceEtudiant::where('matriculeAbsEt', $matriculeAbsEt)->with(['etudiant', 'anneeAcademique'])->first();
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
        $absence = AbsenceEtudiant::create($validatedData);

        return $this->response(['message' => self::ABSENCE_CREATED, 'absence' => $absence], 201);
    }

    /**
     * تحديث غياب معين
     */
    public function update(Request $request, $matriculeAbsEt)
    {
        $absence = AbsenceEtudiant::where('matriculeAbsEt', $matriculeAbsEt)->first();
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
    public function destroy($matriculeAbsEt)
    {
        $absence = AbsenceEtudiant::where('matriculeAbsEt', $matriculeAbsEt)->first();
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
        return $this->response(['count' => AbsenceEtudiant::count()]);
    }
}
