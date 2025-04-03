<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Periode;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class PeriodeController extends Controller
{
    // Constants Errors Messages
    const PERIODE_NOT_FOUND = 'Periode not found';
    const PERIODE_CREATED = 'Periode created successfully';
    const PERIODE_UPDATED = 'Periode updated successfully';
    const PERIODE_DELETED = 'Periode deleted successfully';
    const PERIODE_INVALID_PAGE_PARAMS = 'Invalid pagination parameters';
    const VALIDATION_RULES = [
        'nomPeriode' => 'required|string|max:50',
        'dateDebut' => 'required|date',
        'dateFin' => 'required|date|after:dateDebut'
    ];

    /**
     * إرجاع جميع الفترات
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
        return $this->response(Periode::all());
    }

    /**
     * إرجاع قائمة الفترات بطريقة متدرجة (Pagination)
     */
    public function paginated($start, $length)
    {
        $start = (int) $start;
        $length = (int) $length;

        if ($start < 0 || $length <= 0) {
            return $this->response(['error' => self::PERIODE_INVALID_PAGE_PARAMS], 422);
        }

        $periodes = Periode::skip($start)->take($length)->get();
        return $this->response(['data' => $periodes, 'total' => Periode::count()]);
    }

    /**
     * إرجاع فترة معينة بناءً على الرقم التسلسلي
     */
    public function show($matriculePer)
    {
        $periode = Periode::where('matriculePer', $matriculePer)->first();
        if (!$periode) {
            return $this->response(['error' => self::PERIODE_NOT_FOUND], 404);
        }
        return $this->response($periode);
    }

    /**
     * إنشاء فترة جديدة
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate(self::VALIDATION_RULES);
        $periode = Periode::create($validatedData);

        return $this->response([
            'message' => self::PERIODE_CREATED,
            'periode' => $periode
        ], 201);
    }

    /**
     * تحديث بيانات فترة
     */
    public function update(Request $request, $matriculePer)
    {
        $periode = Periode::where('matriculePer', $matriculePer)->first();
        if (!$periode) {
            return $this->response(['error' => self::PERIODE_NOT_FOUND], 404);
        }

        $validatedData = $request->validate(self::VALIDATION_RULES);
        $periode->update($validatedData);

        return $this->response([
            'message' => self::PERIODE_UPDATED,
            'periode' => $periode
        ]);
    }

    /**
     * حذف فترة معينة
     */
    public function destroy($matriculePer)
    {
        $periode = Periode::where('matriculePer', $matriculePer)->first();
        if (!$periode) {
            return $this->response(['error' => self::PERIODE_NOT_FOUND], 404);
        }

        $periode->delete();
        return $this->response(['message' => self::PERIODE_DELETED]);
    }

    /**
     * حساب عدد الفترات
     */
    public function count()
    {
        return $this->response(['count' => Periode::count()]);
    }
} 