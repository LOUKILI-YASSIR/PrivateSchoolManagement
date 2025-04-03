<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Niveau;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class NiveauController extends Controller
{
    // Constants Errors Messages
    const NIVEAU_NOT_FOUND = 'Niveau not found';
    const NIVEAU_CREATED = 'Niveau created successfully';
    const NIVEAU_UPDATED = 'Niveau updated successfully';
    const NIVEAU_DELETED = 'Niveau deleted successfully';
    const NIVEAU_INVALID_PAGE_PARAMS = 'Invalid pagination parameters';
    const VALIDATION_RULES = [
        'description' => 'required|string',
        'libelle' => 'required|string|max:50',
        'order' => 'required|integer|min:0'
    ];

    /**
     * إرجاع جميع المستويات
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
        return $this->response(Niveau::all());
    }

    /**
     * إرجاع قائمة المستويات بطريقة متدرجة (Pagination)
     */
    public function paginated($start, $length)
    {
        $start = (int) $start;
        $length = (int) $length;

        if ($start < 0 || $length <= 0) {
            return $this->response(['error' => self::NIVEAU_INVALID_PAGE_PARAMS], 422);
        }

        $niveaux = Niveau::skip($start)->take($length)->get();
        return $this->response(['data' => $niveaux, 'total' => Niveau::count()]);
    }

    /**
     * إرجاع مستوى معين بناءً على الرقم التسلسلي
     */
    public function show($matriculeNiv)
    {
        $niveau = Niveau::where('matriculeNiv', $matriculeNiv)->first();
        if (!$niveau) {
            return $this->response(['error' => self::NIVEAU_NOT_FOUND], 404);
        }
        return $this->response($niveau);
    }

    /**
     * إنشاء مستوى جديد
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate(self::VALIDATION_RULES);
        $niveau = Niveau::create($validatedData);

        return $this->response([
            'message' => self::NIVEAU_CREATED,
            'niveau' => $niveau
        ], 201);
    }

    /**
     * تحديث بيانات مستوى
     */
    public function update(Request $request, $matriculeNiv)
    {
        $niveau = Niveau::where('matriculeNiv', $matriculeNiv)->first();
        if (!$niveau) {
            return $this->response(['error' => self::NIVEAU_NOT_FOUND], 404);
        }

        $validatedData = $request->validate(self::VALIDATION_RULES);
        $niveau->update($validatedData);

        return $this->response([
            'message' => self::NIVEAU_UPDATED,
            'niveau' => $niveau
        ]);
    }

    /**
     * حذف مستوى معين
     */
    public function destroy($matriculeNiv)
    {
        $niveau = Niveau::where('matriculeNiv', $matriculeNiv)->first();
        if (!$niveau) {
            return $this->response(['error' => self::NIVEAU_NOT_FOUND], 404);
        }

        $niveau->delete();
        return $this->response(['message' => self::NIVEAU_DELETED]);
    }

    /**
     * حساب عدد المستويات
     */
    public function count()
    {
        return $this->response(['count' => Niveau::count()]);
    }
} 