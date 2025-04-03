<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ProfesseurGroupe;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class ProfesseurGroupeController extends Controller
{
    // Constants Errors Messages
    const PROFESSEUR_GROUPE_NOT_FOUND = 'Professeur groupe not found';
    const PROFESSEUR_GROUPE_CREATED = 'Professeur groupe created successfully';
    const PROFESSEUR_GROUPE_UPDATED = 'Professeur groupe updated successfully';
    const PROFESSEUR_GROUPE_DELETED = 'Professeur groupe deleted successfully';
    const PROFESSEUR_GROUPE_INVALID_PAGE_PARAMS = 'Invalid pagination parameters';
    const VALIDATION_RULES = [
        'matriculePR' => 'required|string|exists:professeurs,matriculePr',
        'matriculeGrp' => 'required|string|exists:groupes,matriculeGrp'
    ];

    /**
     * إرجاع جميع علاقات الأساتذة بالمجموعات
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
        return $this->response(ProfesseurGroupe::with(['professeur', 'groupe'])->get());
    }

    /**
     * إرجاع قائمة علاقات الأساتذة بالمجموعات بطريقة متدرجة (Pagination)
     */
    public function paginated($start, $length)
    {
        $start = (int) $start;
        $length = (int) $length;

        if ($start < 0 || $length <= 0) {
            return $this->response(['error' => self::PROFESSEUR_GROUPE_INVALID_PAGE_PARAMS], 422);
        }

        $relations = ProfesseurGroupe::with(['professeur', 'groupe'])->skip($start)->take($length)->get();
        return $this->response(['data' => $relations, 'total' => ProfesseurGroupe::count()]);
    }

    /**
     * إرجاع علاقة معينة بناءً على المعرف
     */
    public function show($id)
    {
        $relation = ProfesseurGroupe::with(['professeur', 'groupe'])->find($id);
        if (!$relation) {
            return $this->response(['error' => self::PROFESSEUR_GROUPE_NOT_FOUND], 404);
        }
        return $this->response($relation);
    }

    /**
     * إنشاء علاقة جديدة
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate(self::VALIDATION_RULES);
        $relation = ProfesseurGroupe::create($validatedData);

        return $this->response([
            'message' => self::PROFESSEUR_GROUPE_CREATED,
            'relation' => $relation->load(['professeur', 'groupe'])
        ], 201);
    }

    /**
     * تحديث بيانات علاقة
     */
    public function update(Request $request, $id)
    {
        $relation = ProfesseurGroupe::find($id);
        if (!$relation) {
            return $this->response(['error' => self::PROFESSEUR_GROUPE_NOT_FOUND], 404);
        }

        $validatedData = $request->validate(self::VALIDATION_RULES);
        $relation->update($validatedData);

        return $this->response([
            'message' => self::PROFESSEUR_GROUPE_UPDATED,
            'relation' => $relation->load(['professeur', 'groupe'])
        ]);
    }

    /**
     * حذف علاقة معينة
     */
    public function destroy($id)
    {
        $relation = ProfesseurGroupe::find($id);
        if (!$relation) {
            return $this->response(['error' => self::PROFESSEUR_GROUPE_NOT_FOUND], 404);
        }

        $relation->delete();
        return $this->response(['message' => self::PROFESSEUR_GROUPE_DELETED]);
    }

    /**
     * حساب عدد العلاقات
     */
    public function count()
    {
        return $this->response(['count' => ProfesseurGroupe::count()]);
    }
} 