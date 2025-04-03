<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Section;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class SectionController extends Controller
{
    // Constants Errors Messages
    const SECTION_NOT_FOUND = 'Section not found';
    const SECTION_CREATED = 'Section created successfully';
    const SECTION_UPDATED = 'Section updated successfully';
    const SECTION_DELETED = 'Section deleted successfully';
    const SECTION_INVALID_PAGE_PARAMS = 'Invalid pagination parameters';
    const VALIDATION_RULES = [
        'matriculeAnnee' => 'required|string|exists:annees_academiques,matriculeAnnee',
        'nomSection' => 'required|string|max:50',
        'description' => 'required|string'
    ];

    /**
     * إرجاع جميع الأقسام
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
        return $this->response(Section::all());
    }

    /**
     * إرجاع قائمة الأقسام بطريقة متدرجة (Pagination)
     */
    public function paginated($start, $length)
    {
        $start = (int) $start;
        $length = (int) $length;

        if ($start < 0 || $length <= 0) {
            return $this->response(['error' => self::SECTION_INVALID_PAGE_PARAMS], 422);
        }

        $sections = Section::skip($start)->take($length)->get();
        return $this->response(['data' => $sections, 'total' => Section::count()]);
    }

    /**
     * إرجاع قسم معين بناءً على الرقم التسلسلي
     */
    public function show($matriculeSect)
    {
        $section = Section::where('matriculeSect', $matriculeSect)->first();
        if (!$section) {
            return $this->response(['error' => self::SECTION_NOT_FOUND], 404);
        }
        return $this->response($section);
    }

    /**
     * إنشاء قسم جديد
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate(self::VALIDATION_RULES);
        $section = Section::create($validatedData);

        return $this->response([
            'message' => self::SECTION_CREATED,
            'section' => $section
        ], 201);
    }

    /**
     * تحديث بيانات قسم
     */
    public function update(Request $request, $matriculeSect)
    {
        $section = Section::where('matriculeSect', $matriculeSect)->first();
        if (!$section) {
            return $this->response(['error' => self::SECTION_NOT_FOUND], 404);
        }

        $validatedData = $request->validate(self::VALIDATION_RULES);
        $section->update($validatedData);

        return $this->response([
            'message' => self::SECTION_UPDATED,
            'section' => $section
        ]);
    }

    /**
     * حذف قسم معين
     */
    public function destroy($matriculeSect)
    {
        $section = Section::where('matriculeSect', $matriculeSect)->first();
        if (!$section) {
            return $this->response(['error' => self::SECTION_NOT_FOUND], 404);
        }

        $section->delete();
        return $this->response(['message' => self::SECTION_DELETED]);
    }

    /**
     * حساب عدد الأقسام
     */
    public function count()
    {
        return $this->response(['count' => Section::count()]);
    }
} 