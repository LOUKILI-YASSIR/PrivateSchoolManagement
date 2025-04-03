<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AnneeAcademique;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class AnneeAcademiqueController extends Controller
{
    // Constants Errors Messages
    const ANNEE_ACADEMIQUE_NOT_FOUND = 'Annee Academique not found';
    const ANNEE_ACADEMIQUE_CREATED = 'Annee Academique created successfully';
    const ANNEE_ACADEMIQUE_UPDATED = 'Annee Academique updated successfully';
    const ANNEE_ACADEMIQUE_DELETED = 'Annee Academique deleted successfully';
    const ANNEE_ACADEMIQUE_INVALID_PAGE_PARAMS = 'Invalid pagination parameters';
    const VALIDATION_RULES = [
        'matriculeInst' => 'required|string|exists:institutions,matriculeInst',
        'dateDebut' => 'required|date',
        'dateFin' => 'required|date|after:dateDebut',
        'estActive' => 'required|boolean',
        'annee' => 'required|string|max:20'
    ];

    /**
     * إرجاع جميع السنوات الأكاديمية
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
        return $this->response(AnneeAcademique::all());
    }

    /**
     * إرجاع قائمة السنوات الأكاديمية بطريقة متدرجة (Pagination)
     */
    public function paginated($start, $length)
    {
        $start = (int) $start;
        $length = (int) $length;

        if ($start < 0 || $length <= 0) {
            return $this->response(['error' => self::ANNEE_ACADEMIQUE_INVALID_PAGE_PARAMS], 422);
        }

        $annees = AnneeAcademique::skip($start)->take($length)->get();
        return $this->response(['data' => $annees, 'total' => AnneeAcademique::count()]);
    }

    /**
     * إرجاع سنة أكاديمية معينة بناءً على الرقم التسلسلي
     */
    public function show($matriculeAnnee)
    {
        $annee = AnneeAcademique::where('matriculeAnnee', $matriculeAnnee)->first();
        if (!$annee) {
            return $this->response(['error' => self::ANNEE_ACADEMIQUE_NOT_FOUND], 404);
        }
        return $this->response($annee);
    }

    /**
     * إنشاء سنة أكاديمية جديدة
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate(self::VALIDATION_RULES);
        $annee = AnneeAcademique::create($validatedData);

        return $this->response([
            'message' => self::ANNEE_ACADEMIQUE_CREATED,
            'annee' => $annee
        ], 201);
    }

    /**
     * تحديث بيانات سنة أكاديمية
     */
    public function update(Request $request, $matriculeAnnee)
    {
        $annee = AnneeAcademique::where('matriculeAnnee', $matriculeAnnee)->first();
        if (!$annee) {
            return $this->response(['error' => self::ANNEE_ACADEMIQUE_NOT_FOUND], 404);
        }

        $validatedData = $request->validate(self::VALIDATION_RULES);
        $annee->update($validatedData);

        return $this->response([
            'message' => self::ANNEE_ACADEMIQUE_UPDATED,
            'annee' => $annee
        ]);
    }

    /**
     * حذف سنة أكاديمية معينة
     */
    public function destroy($matriculeAnnee)
    {
        $annee = AnneeAcademique::where('matriculeAnnee', $matriculeAnnee)->first();
        if (!$annee) {
            return $this->response(['error' => self::ANNEE_ACADEMIQUE_NOT_FOUND], 404);
        }

        $annee->delete();
        return $this->response(['message' => self::ANNEE_ACADEMIQUE_DELETED]);
    }

    /**
     * حساب عدد السنوات الأكاديمية
     */
    public function count()
    {
        return $this->response(['count' => AnneeAcademique::count()]);
    }
}
