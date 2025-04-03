<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class UserController extends Controller
{
    // Constants Errors Messages
    const USER_NOT_FOUND = 'User not found';
    const USER_CREATED = 'User created successfully';
    const USER_UPDATED = 'User updated successfully';
    const USER_DELETED = 'User deleted successfully';
    const USER_INVALID_PAGE_PARAMS = 'Invalid pagination parameters';
    const VALIDATION_RULES = [
        'matriculeUt' => 'required|string|unique:users',
        'nomUt' => 'required|string|unique:users',
        'passwordUt' => 'required|string|min:8',
        'roleUt' => 'required|in:etudiant,professeur,admin'
    ];

    const UPDATE_VALIDATION_RULES = [
        'nomUt' => 'nullable|string|unique:users',
        'passwordUt' => 'nullable|string|min:8',
        'roleUt' => 'nullable|in:etudiant,professeur,admin'
    ];

    /**
     * إرجاع جميع المستخدمين
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
        return $this->response(User::all());
    }

    /**
     * إرجاع قائمة المستخدمين بطريقة متدرجة (Pagination)
     */
    public function paginated($start, $length)
    {
        $start = (int) $start;
        $length = (int) $length;

        if ($start < 0 || $length <= 0) {
            return $this->response(['error' => self::USER_INVALID_PAGE_PARAMS], 422);
        }

        $users = User::skip($start)->take($length)->get();
        return $this->response(['data' => $users, 'total' => User::count()]);
    }

    /**
     * إرجاع مستخدم معين بناءً على المعرف
     */
    public function show($matriculeUt)
    {
        $user = User::where('matriculeUt', $matriculeUt)->first();
        if (!$user) {
            return $this->response(['error' => self::USER_NOT_FOUND], 404);
        }
        return $this->response($user);
    }

    /**
     * إنشاء مستخدم جديد
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate(self::VALIDATION_RULES);
        $user = User::create([
            'matriculeUt' => $validatedData['matriculeUt'],
            'nomUt' => $validatedData['nomUt'],
            'passwordUt' => Hash::make($validatedData['passwordUt']),
            'roleUt' => $validatedData['roleUt']
        ]);

        return $this->response([
            'message' => self::USER_CREATED,
            'user' => $user
        ], 201);
    }

    /**
     * تحديث بيانات مستخدم
     */
    public function update(Request $request, $matriculeUt)
    {
        $user = User::where('matriculeUt', $matriculeUt)->first();
        if (!$user) {
            return $this->response(['error' => self::USER_NOT_FOUND], 404);
        }

        $validatedData = $request->validate(self::UPDATE_VALIDATION_RULES);
        
        $user->update([
            'nomUt' => $validatedData['nomUt'] ?? $user->nomUt,
            'passwordUt' => isset($validatedData['passwordUt']) ? Hash::make($validatedData['passwordUt']) : $user->passwordUt,
            'roleUt' => $validatedData['roleUt'] ?? $user->roleUt
        ]);

        return $this->response([
            'message' => self::USER_UPDATED,
            'user' => $user
        ]);
    }

    /**
     * حذف مستخدم معين
     */
    public function destroy($matriculeUt)
    {
        $user = User::where('matriculeUt', $matriculeUt)->first();
        if (!$user) {
            return $this->response(['error' => self::USER_NOT_FOUND], 404);
        }

        $user->delete();
        return $this->response(['message' => self::USER_DELETED]);
    }

    /**
     * حساب عدد المستخدمين
     */
    public function count()
    {
        return $this->response(['count' => User::count()]);
    }
}
