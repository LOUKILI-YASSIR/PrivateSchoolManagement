<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Str;
use Carbon\Carbon;
use Illuminate\Support\Facades\Mail;

class AuthController extends Controller
{
    const USER_NOT_FOUND = 'User not found';
    const USER_CREATED = 'User created successfully';
    const LOGIN_SUCCESS = 'Login successful';
    const LOGOUT_SUCCESS = 'Successfully logged out';
    const INVALID_CREDENTIALS = 'Invalid credentials';
    const TOKEN_INVALID = 'Invalid token';
    const TOKEN_EXPIRED = 'Token has expired';
    const UNAUTHORIZED = 'Unauthorized access';
    const PASSWORD_RESET_LINK_SENT = 'Password reset link has been sent';
    const PASSWORD_RESET_SUCCESS = 'Password has been reset successfully';
    const INVALID_RESET_TOKEN = 'Invalid reset token';
    const EXPIRED_RESET_TOKEN = 'Reset token has expired';

    private function response($data, $statusCode = 200)
    {
        return response()->json($data, $statusCode)
            ->header('Access-Control-Allow-Origin', '*')
            ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
            ->header('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization');
    }

    public function register(Request $request)
    {
        $request->validate([
            'nomUsers' => 'required|string|max:255',
            'email' => 'nullable|email|unique:users,email',
            'phone_number' => 'nullable|string|unique:users,phone_number',
            'matricule' => 'required|string|unique:users',
            'role' => 'required|in:admin,professeur,etudiant',
            'password' => 'required|string|min:8',
        ]);

        $user = User::create([
            'matriculeUt' => 'YLSCHOOL_' . date('Y') . '_UT_' . strtoupper(substr($request->role, 0, 2)) . '_' . str_pad(User::count() + 1, 5, '0', STR_PAD_LEFT),
            'nomUsers' => $request->nomUsers,
            'email' => $request->email,
            'phone_number' => $request->phone_number,
            'matricule' => $request->matricule,
            'role' => $request->role,
            'password' => Hash::make($request->password),
        ]);

        $token = $user->generateApiToken();

        return $this->response([
            'message' => self::USER_CREATED,
            'user' => $user,
            'token' => $token,
        ], 201);
    }

    /**
     * Login a user
     */

     public function login(Request $request)
     {
         // التحقق من صحة البيانات المدخلة
         $request->validate([
             'login' => 'required|string', // يمكن أن يكون matricule أو email أو phone_number أو nomUsers
             'password' => 'required|string'
         ]);

         // البحث عن المستخدم باستخدام matricule أو email أو phone_number أو nomUsers
         $user = User::where('matricule', $request->login)
                     ->orWhere('email', $request->login)
                     ->orWhere('phone_number', $request->login)
                     ->orWhere('nomUsers', $request->login)
                     ->first();

         // التحقق من صحة المستخدم وكلمة المرور
         if (!$user || !Hash::check($request->password, $user->password)) {
             return response()->json([
                 'message' => 'بيانات تسجيل الدخول غير صحيحة'
             ], 401);
         }

         // إنشاء أو تحديث API Token
         $token = $user->generateApiToken();

         // إرجاع بيانات المستخدم مع التوكن
         return response()->json([
             'user' => $user,
             'token' => $token,
             'token_type' => 'Bearer'
         ], 200);
     }

    /**
     * Logout a user
     */
    public function logout(Request $request)
    {
        $user = $request->user();

        if ($user) {
            $user->api_token = null;
            $user->save();
        }

        return $this->response(['message' => self::LOGOUT_SUCCESS]);
    }

    /**
     * Update the user's profile
     */
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return $this->response(['error' => self::UNAUTHORIZED], 401);
        }

        $validatedData = $request->validate([
            'nomUsers' => 'nullable|string',
            'email' => 'nullable|email|unique:users,email,' . $user->matriculeUt . ',matriculeUt',
            'phone_number' => 'nullable|string|unique:users,phone_number,' . $user->matriculeUt . ',matriculeUt',
            'password' => 'nullable|string|min:8',
            'oldPassword' => 'required_with:password|string'
        ]);

        // Check old password if trying to change password
        if (isset($validatedData['password'])) {
            if (!Hash::check($validatedData['oldPassword'], $user->password)) {
                throw ValidationException::withMessages([
                    'oldPassword' => ['Current password is incorrect'],
                ]);
            }
        }

        $user->update([
            'nomUsers' => $validatedData['nomUsers'] ?? $user->nomUsers,
            'email' => $validatedData['email'] ?? $user->email,
            'phone_number' => $validatedData['phone_number'] ?? $user->phone_number,
            'password' => isset($validatedData['password']) ? Hash::make($validatedData['password']) : $user->password
        ]);

        return $this->response([
            'message' => 'Profile updated successfully',
            'user' => $user
        ]);
    }

    /**
     * Refresh user token
     */
    public function refreshToken(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return $this->response(['error' => self::UNAUTHORIZED], 401);
        }

        $token = $user->generateApiToken();

        return $this->response([
            'token' => $token,
            'token_type' => 'Bearer'
        ]);
    }

    /**
     * Request a password reset
     */
    public function forgotPassword(Request $request)
    {
        $request->validate([
            'login' => 'required|string'
        ]);

        // Find the user by username, email, or phone number
        $user = User::where('nomUsers', $request->login)
                    ->orWhere('email', $request->login)
                    ->orWhere('phone_number', $request->login)
                    ->first();

        if (!$user) {
            return $this->response(['error' => self::USER_NOT_FOUND], 404);
        }

        // Generate a reset token
        $resetToken = Str::random(60);
        $user->reset_token = $resetToken;
        $user->reset_token_expires_at = Carbon::now()->addHours(1); // Token expires in 1 hour
        $user->save();

        // Send reset token via email if email is available
        if ($user->email) {
            // In a real application, you would send an email here
            // Mail::to($user->email)->send(new ResetPasswordMail($resetToken));
        }

        return $this->response(['message' => self::PASSWORD_RESET_LINK_SENT]);
    }

    /**
     * Reset password using token
     */
    public function resetPassword(Request $request)
    {
        $request->validate([
            'token' => 'required|string',
            'password' => 'required|string|min:8|confirmed'
        ]);

        $user = User::where('reset_token', $request->token)->first();

        if (!$user) {
            return $this->response(['error' => self::INVALID_RESET_TOKEN], 400);
        }

        if (Carbon::now()->isAfter($user->reset_token_expires_at)) {
            return $this->response(['error' => self::EXPIRED_RESET_TOKEN], 400);
        }

        $user->password = Hash::make($request->password);
        $user->reset_token = null;
        $user->reset_token_expires_at = null;
        $user->save();

        return $this->response(['message' => self::PASSWORD_RESET_SUCCESS]);
    }

    public function me(Request $request)
    {
        return response()->json($request->user());
    }
}
