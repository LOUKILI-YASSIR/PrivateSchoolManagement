<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\EmploiDuTemps;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class EmploiDuTempsController extends Controller
{
    // Constants Errors Messages
    const EMPLOI_DU_TEMPS_NOT_FOUND = 'Emploi du temps not found';
    const EMPLOI_DU_TEMPS_CREATED = 'Emploi du temps created successfully';
    const EMPLOI_DU_TEMPS_UPDATED = 'Emploi du temps updated successfully';
    const EMPLOI_DU_TEMPS_DELETED = 'Emploi du temps deleted successfully';
    const EMPLOI_DU_TEMPS_INVALID_PAGE_PARAMS = 'Invalid pagination parameters';
    const VALIDATION_RULES = [
        'matriculeMat' => 'required|string|exists:matieres,matriculeMat',
        'matriculeGrp' => 'required|string|exists:groupes,matriculeGrp',
        'matriculeSes' => 'required|string|exists:sessions,id',
        'matriculeAnnee' => 'required|string|exists:annees_academiques,matriculeAnnee',
        'matriculeSalle' => 'required|string|exists:salles,matriculeSalle',
        'matriculeInst' => 'required|string|exists:institutions,matriculeInst',
        'matriculePer' => 'required|string|exists:periodes,matriculePer',
        'matriculePr' => 'required|string|exists:professeurs,matriculePr',
        'heureDebut' => 'required|date_format:H:i',
        'heureFin' => 'required|date_format:H:i|after:heureDebut',
        'jourSemaine' => 'required|string|in:Lundi,Mardi,Mercredi,Jeudi,Vendredi,Samedi'
    ];

    /**
     * إرجاع جميع جداول المواعيد
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
        return $this->response(EmploiDuTemps::all());
    }

    /**
     * إرجاع قائمة جداول المواعيد بطريقة متدرجة (Pagination)
     */
    public function paginated($start, $length)
    {
        $start = (int) $start;
        $length = (int) $length;

        if ($start < 0 || $length <= 0) {
            return $this->response(['error' => self::EMPLOI_DU_TEMPS_INVALID_PAGE_PARAMS], 422);
        }

        $emplois = EmploiDuTemps::skip($start)->take($length)->get();
        return $this->response(['data' => $emplois, 'total' => EmploiDuTemps::count()]);
    }

    /**
     * إرجاع جدول مواعيد معين بناءً على الرقم التسلسلي
     */
    public function show($matriculeEmpt)
    {
        $emploi = EmploiDuTemps::where('matriculeEmpt', $matriculeEmpt)->first();
        if (!$emploi) {
            return $this->response(['error' => self::EMPLOI_DU_TEMPS_NOT_FOUND], 404);
        }
        return $this->response($emploi);
    }

    /**
     * إنشاء جدول مواعيد جديد
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate(self::VALIDATION_RULES);
        $emploi = EmploiDuTemps::create($validatedData);

        return $this->response([
            'message' => self::EMPLOI_DU_TEMPS_CREATED,
            'emploi' => $emploi
        ], 201);
    }

    /**
     * تحديث بيانات جدول مواعيد
     */
    public function update(Request $request, $matriculeEmpt)
    {
        $emploi = EmploiDuTemps::where('matriculeEmpt', $matriculeEmpt)->first();
        if (!$emploi) {
            return $this->response(['error' => self::EMPLOI_DU_TEMPS_NOT_FOUND], 404);
        }

        $validatedData = $request->validate(self::VALIDATION_RULES);
        $emploi->update($validatedData);

        return $this->response([
            'message' => self::EMPLOI_DU_TEMPS_UPDATED,
            'emploi' => $emploi
        ]);
    }

    /**
     * حذف جدول مواعيد معين
     */
    public function destroy($matriculeEmpt)
    {
        $emploi = EmploiDuTemps::where('matriculeEmpt', $matriculeEmpt)->first();
        if (!$emploi) {
            return $this->response(['error' => self::EMPLOI_DU_TEMPS_NOT_FOUND], 404);
        }

        $emploi->delete();
        return $this->response(['message' => self::EMPLOI_DU_TEMPS_DELETED]);
    }

    /**
     * حساب عدد جداول المواعيد
     */
    public function count()
    {
        return $this->response(['count' => EmploiDuTemps::count()]);
    }
} 