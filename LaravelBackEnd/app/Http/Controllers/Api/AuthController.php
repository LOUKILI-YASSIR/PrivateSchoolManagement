<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Illuminate\Validation\Rule;
use Exception;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;

/**
 * Authentication Controller
 *
 * Handles all operations related to user authentication including:
 * - Login and logout
 * - Password reset
 * - Token management
 * - Profile updates
 */
class AuthController extends Controller
{
    /**
     * Token type for API authentication
     */
    private const TOKEN_TYPE = 'Bearer';

    /**
     * Available user roles
     */
    private const ROLES = [
        'admin',
        'professeur',
        'etudiant',
    ];

    /**
     * Available user statuses
     */
    private const STATUTS = [
        'online',
        'offline',
        'away',
    ];

    /**
     * Validation rules for user login
     */
    private const LOGIN_RULES = [
        'identifier' => 'required|string',
        'passwordUt' => 'required|string',
        'remember_me' => 'boolean',
    ];

    /**
     * Validation rules for password reset request
     */
    private const PASSWORD_RESET_REQUEST_RULES = [
        'emailUt' => 'required|string|email',
    ];

    /**
     * Validation rules for password reset confirmation
     */
    private const PASSWORD_RESET_CONFIRM_RULES = [
        'emailUt' => 'required|string|email',
        'passwordUt' => 'required|string|min:8|confirmed',
        'passwordUt_confirmation' => 'required',
        'token' => 'required|string',
    ];

    /**
     * Login user and create token
     *
     * @param Request $request The request containing login credentials
     * @return JsonResponse The response containing the user and access token
     */
    public function login(Request $request): JsonResponse
    {
        try {
            $validatedData = $request->validate(self::LOGIN_RULES);

            $identifier = $validatedData['identifier'];
            $password = $validatedData['passwordUt'];

            // Determine the field type (email, username, or phone)
            $field = filter_var($identifier, FILTER_VALIDATE_EMAIL) ? 'emailUt' :
                (preg_match('/^\+?[1-9]\d{1,14}$/', $identifier) ? 'phoneUt' : 'usernameUt');

            // Find the user
            $user = User::where($field, $identifier)->first();

            if (!$user) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'User not found',
                ], Response::HTTP_UNAUTHORIZED);
            }

            if (!Hash::check($password, $user->passwordUt)) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Invalid password',
                ], Response::HTTP_UNAUTHORIZED);
            }

            // Create token
            $token = $user->createToken('auth_token')->plainTextToken;

            // Update user status
            $user->update(['statutUt' => 'online']);

            return response()->json([
                'status' => 'success',
                'message' => 'Login successful',
                'data' => [
                    'user' => $user,
                    'access_token' => $token,
                    'token_type' => self::TOKEN_TYPE,
                ],
            ], Response::HTTP_OK);
        } catch (ValidationException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        } catch (Exception $e) {
            Log::error('Login error: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'An unexpected error occurred',
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Logout user (revoke the token)
     *
     * @param Request $request The request containing the user's token
     * @return JsonResponse The response indicating successful logout
     */
    public function logout(Request $request): JsonResponse
    {
        try {
            if ($request->user()) {
                $request->user()->currentAccessToken()->delete();
            }
            return response()->json([
                'status' => 'success',
                'message' => 'Logout successful',
            ], Response::HTTP_OK);
        } catch (Exception $e) {
            Log::error('Logout error: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'An unexpected error occurred',
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Get authenticated user information
     *
     * @param Request $request The request containing the user's token
     * @return JsonResponse The response containing the user's information
     */
    public function user(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            if (!$user) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'User not found',
                ], Response::HTTP_UNAUTHORIZED);
            }
            return response()->json([
                'status' => 'success',
                'message' => 'User retrieved successfully',
                'data' => $user,
            ], Response::HTTP_OK);
        } catch (Exception $e) {
            Log::error('User retrieval error: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'An unexpected error occurred',
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Send password reset link
     *
     * @param Request $request The request containing the user's email
     * @return JsonResponse The response indicating the status of the reset link
     */
    public function sendPasswordResetLink(Request $request): JsonResponse
    {
        try {
            $validatedData = $request->validate(self::PASSWORD_RESET_REQUEST_RULES);

            $user = User::where('emailUt', $validatedData['emailUt'])->first();
            if (!$user) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'User not found',
                ], Response::HTTP_NOT_FOUND);
            }

            $status = Password::sendResetLink(['email' => $validatedData['emailUt']]);

            if ($status === Password::RESET_LINK_SENT) {
                return response()->json([
                    'status' => 'success',
                    'message' => 'Reset link sent successfully',
                    'data' => ['status' => $status],
                ], Response::HTTP_OK);
            }

            return response()->json([
                'status' => 'error',
                'message' => 'Failed to send reset link',
            ], Response::HTTP_BAD_REQUEST);
        } catch (ValidationException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        } catch (Exception $e) {
            Log::error('Password reset link error: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'An unexpected error occurred',
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Reset password
     *
     * @param Request $request The request containing the reset token and new password
     * @return JsonResponse The response indicating the status of the password reset
     */
    public function resetPassword(Request $request): JsonResponse
    {
        try {
            $validatedData = $request->validate(self::PASSWORD_RESET_CONFIRM_RULES);

            $credentials = [
                'email' => $validatedData['emailUt'],
                'password' => $validatedData['passwordUt'],
                'password_confirmation' => $validatedData['passwordUt_confirmation'],
                'token' => $validatedData['token'],
            ];

            $status = Password::reset(
                $credentials,
                function ($user, $password) {
                    $user->forceFill([
                        'passwordUt' => Hash::make($password),
                        'remember_token' => Str::random(60),
                    ])->save();
                }
            );

            if ($status === Password::PASSWORD_RESET) {
                return response()->json([
                    'status' => 'success',
                    'message' => 'Password reset successfully',
                    'data' => ['status' => $status],
                ], Response::HTTP_OK);
            }

            return response()->json([
                'status' => 'error',
                'message' => 'Failed to reset password',
            ], Response::HTTP_BAD_REQUEST);
        } catch (ValidationException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        } catch (Exception $e) {
            Log::error('Password reset error: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'An unexpected error occurred',
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Refresh user token
     *
     * @param Request $request The request containing the current token
     * @return JsonResponse The response containing the new access token
     */
    public function refreshToken(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            if (!$user) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'User not found',
                ], Response::HTTP_UNAUTHORIZED);
            }
            $user->currentAccessToken()->delete();
            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'status' => 'success',
                'message' => 'Token refreshed successfully',
                'data' => [
                    'access_token' => $token,
                    'token_type' => self::TOKEN_TYPE,
                ],
            ], Response::HTTP_OK);
        } catch (Exception $e) {
            Log::error('Token refresh error: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'An unexpected error occurred',
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Check if the current token is valid
     *
     * @param Request $request The request containing the token
     * @return JsonResponse The response indicating if the token is valid
     */
    public function checkToken(Request $request): JsonResponse
    {
        try {
            if ($request->user()) {
                return response()->json([
                    'status' => 'success',
                    'message' => 'Token is valid',
                    'valid' => true,
                ], Response::HTTP_OK);
            }
            return response()->json([
                'status' => 'error',
                'message' => 'Token is invalid',
                'valid' => false,
            ], Response::HTTP_UNAUTHORIZED);
        } catch (Exception $e) {
            Log::error('Token check error: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Error checking token',
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Update authenticated user profile information
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function updateProfile(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            if (!$user) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'User not found',
                ], Response::HTTP_UNAUTHORIZED);
            }

            // Define updatable fields and validation rules
            $updateRules = [
                'NomPl' => 'sometimes|string|max:255',
                'PrenomPl' => 'sometimes|string|max:255',
                'emailUt' => ['sometimes', 'string', 'email', 'max:255', Rule::unique('users', 'emailUt')->ignore($user->id)],
                'usernameUt' => ['sometimes', 'string', 'max:255', Rule::unique('users', 'usernameUt')->ignore($user->id)],
                'phoneUt' => 'nullable|string|max:20',
                'current_password' => 'required_with:new_password|string',
                'new_password' => 'sometimes|string|min:8|confirmed',
            ];

            $validatedData = $request->validate($updateRules);

            // Handle password change
            if (!empty($validatedData['new_password'])) {
                if (!Hash::check($validatedData['current_password'], $user->passwordUt)) {
                    return response()->json([
                        'status' => 'error',
                        'message' => 'Current password does not match',
                    ], Response::HTTP_UNPROCESSABLE_ENTITY);
                }
                $validatedData['passwordUt'] = Hash::make($validatedData['new_password']);
            }

            // Remove password fields
            unset($validatedData['current_password'], $validatedData['new_password'], $validatedData['new_password_confirmation']);

            // Update user
            $user->update($validatedData);

            return response()->json([
                'status' => 'success',
                'message' => 'Profile updated successfully',
                'data' => $user->fresh(),
            ], Response::HTTP_OK);
        } catch (ValidationException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        } catch (Exception $e) {
            Log::error('Profile update error: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'An unexpected error occurred during profile update',
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}