<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Professeur;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class ProfesseurController extends Controller
{
    // Constants Errors Messages
    const PROFESSEUR_NOT_FOUND = 'Professeur not found';
    const PROFESSEUR_CREATED = 'Professeur created successfully';
    const PROFESSEUR_UPDATED = 'Professeur updated successfully';
    const PROFESSEUR_DELETED = 'Professeur deleted successfully';
    const PROFESSEUR_INVALID_PAGE_PARAMS = 'Invalid pagination parameters';
    const VALIDATION_RULES = [
        'image_urlPr' => 'required|string|max:2083',
        'civilitePr' => 'required|string|max:4',
        'nomPr' => 'required|string|max:50',
        'prenomPr' => 'required|string|max:30',
        'nationalitePr' => 'nullable|string|max:60',
        'CINPr' => 'nullable|string|max:20',
        'DateNaissancePr' => 'required|date',
        'adressePr' => 'nullable|string|max:150',
        'villePr' => 'nullable|string|max:100',
        'CodePostalPr' => 'nullable|integer',
        'paysPr' => 'nullable|string|max:60',
        'emailPr' => 'required|email|max:100|unique:professeurs',
        'Telephone1Pr' => 'nullable|string|max:20',
        'Telephone2Pr' => 'nullable|string|max:20',
        'dateEmbauchePr' => 'required|date',
        'salairePr' => 'required|numeric|min:0',
        'NomBanquePr' => 'nullable|string|max:100',
        'RIBPr' => 'nullable|string|max:34',
        'observationPr' => 'nullable|string',
        'matriculeMat' => 'required|string|exists:matieres,matriculeMat'
    ];

    /**
     * إرجاع جميع الأساتذة
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
        return $this->response(Professeur::all());
    }

    /**
     * إرجاع قائمة الأساتذة بطريقة متدرجة (Pagination)
     */
    public function paginated($start, $length)
    {
        $start = (int) $start;
        $length = (int) $length;

        if ($start < 0 || $length <= 0) {
            return $this->response(['error' => self::PROFESSEUR_INVALID_PAGE_PARAMS], 422);
        }

        $professeurs = Professeur::skip($start)->take($length)->get();
        return $this->response(['data' => $professeurs, 'total' => Professeur::count()]);
    }

    /**
     * إرجاع أستاذ معين بناءً على الرقم التسلسلي
     */
    public function show($matriculePr)
    {
        $professeur = Professeur::where('matriculePr', $matriculePr)->first();
        if (!$professeur) {
            return $this->response(['error' => self::PROFESSEUR_NOT_FOUND], 404);
        }
        return $this->response($professeur);
    }

    /**
     * إنشاء أستاذ جديد
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate(self::VALIDATION_RULES);
        $professeur = Professeur::create($validatedData);

        return $this->response([
            'message' => self::PROFESSEUR_CREATED,
            'professeur' => $professeur
        ], 201);
    }

    /**
     * تحديث بيانات أستاذ
     */
    public function update(Request $request, $matriculePr)
    {
        $professeur = Professeur::where('matriculePr', $matriculePr)->first();
        if (!$professeur) {
            return $this->response(['error' => self::PROFESSEUR_NOT_FOUND], 404);
        }

        $validatedData = $request->validate(self::VALIDATION_RULES);
        $professeur->update($validatedData);

        return $this->response([
            'message' => self::PROFESSEUR_UPDATED,
            'professeur' => $professeur
        ]);
    }

    /**
     * حذف أستاذ معين
     */
    public function destroy($matriculePr)
    {
        $professeur = Professeur::where('matriculePr', $matriculePr)->first();
        if (!$professeur) {
            return $this->response(['error' => self::PROFESSEUR_NOT_FOUND], 404);
        }

        $professeur->delete();
        return $this->response(['message' => self::PROFESSEUR_DELETED]);
    }

    /**
     * حساب عدد الأساتذة
     */
    public function count()
    {
        return $this->response(['count' => Professeur::count()]);
    }
}
