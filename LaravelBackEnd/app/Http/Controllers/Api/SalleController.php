<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Salle;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class SalleController extends Controller
{
    // Constants Errors Messages
    const SALLE_NOT_FOUND = 'Salle not found';
    const SALLE_CREATED = 'Salle created successfully';
    const SALLE_UPDATED = 'Salle updated successfully';
    const SALLE_DELETED = 'Salle deleted successfully';
    const SALLE_INVALID_PAGE_PARAMS = 'Invalid pagination parameters';
    const VALIDATION_RULES = [
        'capacite' => 'required|integer|min:1',
        'description' => 'required|string',
        'nomSalle' => 'required|string|max:50'
    ];

    /**
     * إرجاع جميع القاعات
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
        return $this->response(Salle::all());
    }

    /**
     * إرجاع قائمة القاعات بطريقة متدرجة (Pagination)
     */
    public function paginated($start, $length)
    {
        $start = (int) $start;
        $length = (int) $length;

        if ($start < 0 || $length <= 0) {
            return $this->response(['error' => self::SALLE_INVALID_PAGE_PARAMS], 422);
        }

        $salles = Salle::skip($start)->take($length)->get();
        return $this->response(['data' => $salles, 'total' => Salle::count()]);
    }

    /**
     * إرجاع قاعة معينة بناءً على الرقم التسلسلي
     */
    public function show($matriculeSalle)
    {
        $salle = Salle::where('matriculeSalle', $matriculeSalle)->first();
        if (!$salle) {
            return $this->response(['error' => self::SALLE_NOT_FOUND], 404);
        }
        return $this->response($salle);
    }

    /**
     * إنشاء قاعة جديدة
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate(self::VALIDATION_RULES);
        $salle = Salle::create($validatedData);

        return $this->response([
            'message' => self::SALLE_CREATED,
            'salle' => $salle
        ], 201);
    }

    /**
     * تحديث بيانات قاعة
     */
    public function update(Request $request, $matriculeSalle)
    {
        $salle = Salle::where('matriculeSalle', $matriculeSalle)->first();
        if (!$salle) {
            return $this->response(['error' => self::SALLE_NOT_FOUND], 404);
        }

        $validatedData = $request->validate(self::VALIDATION_RULES);
        $salle->update($validatedData);

        return $this->response([
            'message' => self::SALLE_UPDATED,
            'salle' => $salle
        ]);
    }

    /**
     * حذف قاعة معينة
     */
    public function destroy($matriculeSalle)
    {
        $salle = Salle::where('matriculeSalle', $matriculeSalle)->first();
        if (!$salle) {
            return $this->response(['error' => self::SALLE_NOT_FOUND], 404);
        }

        $salle->delete();
        return $this->response(['message' => self::SALLE_DELETED]);
    }

    /**
     * حساب عدد القاعات
     */
    public function count()
    {
        return $this->response(['count' => Salle::count()]);
    }
} 