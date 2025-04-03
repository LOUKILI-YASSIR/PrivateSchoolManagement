<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Groupe;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class GroupeController extends Controller
{
    // Constants Errors Messages
    const GROUPE_NOT_FOUND = 'Groupe not found';
    const GROUPE_CREATED = 'Groupe created successfully';
    const GROUPE_UPDATED = 'Groupe updated successfully';
    const GROUPE_DELETED = 'Groupe deleted successfully';
    const GROUPE_INVALID_PAGE_PARAMS = 'Invalid pagination parameters';
    const VALIDATION_RULES = [
        'matriculeNiv' => 'required|string|exists:niveaux,matriculeNiv',
        'matriculeSect' => 'required|string|exists:sections,matriculeSect',
        'capacite' => 'required|integer|min:1',
        'description' => 'required|string',
        'nomGroupe' => 'required|string|max:50'
    ];

    /**
     * إرجاع جميع المجموعات
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
        return $this->response(Groupe::all());
    }

    /**
     * إرجاع قائمة المجموعات بطريقة متدرجة (Pagination)
     */
    public function paginated($start, $length)
    {
        $start = (int) $start;
        $length = (int) $length;

        if ($start < 0 || $length <= 0) {
            return $this->response(['error' => self::GROUPE_INVALID_PAGE_PARAMS], 422);
        }

        $groupes = Groupe::skip($start)->take($length)->get();
        return $this->response(['data' => $groupes, 'total' => Groupe::count()]);
    }

    /**
     * إرجاع مجموعة معينة بناءً على الرقم التسلسلي
     */
    public function show($matriculeGrp)
    {
        $groupe = Groupe::where('matriculeGrp', $matriculeGrp)->first();
        if (!$groupe) {
            return $this->response(['error' => self::GROUPE_NOT_FOUND], 404);
        }
        return $this->response($groupe);
    }

    /**
     * إنشاء مجموعة جديدة
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate(self::VALIDATION_RULES);
        $groupe = Groupe::create($validatedData);

        return $this->response([
            'message' => self::GROUPE_CREATED,
            'groupe' => $groupe
        ], 201);
    }

    /**
     * تحديث بيانات مجموعة
     */
    public function update(Request $request, $matriculeGrp)
    {
        $groupe = Groupe::where('matriculeGrp', $matriculeGrp)->first();
        if (!$groupe) {
            return $this->response(['error' => self::GROUPE_NOT_FOUND], 404);
        }

        $validatedData = $request->validate(self::VALIDATION_RULES);
        $groupe->update($validatedData);

        return $this->response([
            'message' => self::GROUPE_UPDATED,
            'groupe' => $groupe
        ]);
    }

    /**
     * حذف مجموعة معينة
     */
    public function destroy($matriculeGrp)
    {
        $groupe = Groupe::where('matriculeGrp', $matriculeGrp)->first();
        if (!$groupe) {
            return $this->response(['error' => self::GROUPE_NOT_FOUND], 404);
        }

        $groupe->delete();
        return $this->response(['message' => self::GROUPE_DELETED]);
    }

    /**
     * حساب عدد المجموعات
     */
    public function count()
    {
        return $this->response(['count' => Groupe::count()]);
    }
} 