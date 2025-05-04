<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Illuminate\Validation\Rule;
use Exception;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Crypt; 
use Twilio\Rest\Client;
use Illuminate\Support\Facades\Mail;
use Vonage\SMS\Client as SMSClient;

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
    private const MAX_LOGIN_ATTEMPTS = 5;
    private const LOCKOUT_SECONDS    = 60;

    // Maximum attempts and throttle duration in seconds
    private const MAX_PASSWORD_RESET_ATTEMPTS = 5;
    private const PASSWORD_RESET_THROTTLE_SECONDS = 60;
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
        'PasswordUT' => 'required|string',
        'remember_me' => 'boolean',
    ];

    /**
     * Validation rules for password reset request
     */
    private const PASSWORD_RESET_REQUEST_RULES = [
        'EmailUT' => 'required|string|email',
    ];

    /**
     * Validation rules for password reset confirmation
     */
    private const PASSWORD_RESET_CONFIRM_RULES = [
        'EmailUT' => 'required|string|email',
        'PasswordUT' => 'required|string|min:8|confirmed',
        'PasswordConfirmationUT' => 'required',
        'CodeVerificationUT' => 'required|string',
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
        // Build a unique rate‑limit key per identifier+IP
        $identifier = (string) $request->input('identifier', '');
        $throttleKey = Str::slug(Str::lower($identifier)) . '|' . $request->ip();

        // 1) Throttle check
        if (RateLimiter::tooManyAttempts($throttleKey, self::MAX_LOGIN_ATTEMPTS)) {
            $seconds = RateLimiter::availableIn($throttleKey);
            return response()->json([
                'status'  => 'error',
                'message' => "Too many login attempts. Try again in {$seconds} seconds.",
            ], Response::HTTP_TOO_MANY_REQUESTS);
        }

        try {
            // 2) Validate input
            $validated = $request->validate([
                'identifier'  => [
                    'required', 'string',
                    function($attr, $value, $fail) {
                        if (
                            !filter_var($value, FILTER_VALIDATE_EMAIL) &&
                            !preg_match('/^\+?[1-9]\d{1,14}$/', $value) &&
                            !preg_match('/^[a-zA-Z0-9_]{3,}$/', $value)
                        ) {
                            $fail('Identifier must be a valid email, phone number, or username.');
                        }
                    },
                ],
                'PasswordUT'  => 'required|string',
                'remember_me' => 'boolean',
            ]);

            // 3) Determine which column to query
            if (filter_var($validated['identifier'], FILTER_VALIDATE_EMAIL)) {
                $field = 'EmailUT';
            } elseif (preg_match('/^\+?[1-9]\d{1,14}$/', $validated['identifier'])) {
                $field = 'PhoneUT';
            } else {
                $field = 'UserNameUT';
            }

            // 4) Fetch user and verify password
            $user = User::where($field, $validated['identifier'])->first();
            if (! $user || ! Hash::check($validated['PasswordUT'], $user->PasswordUT)) {
                RateLimiter::hit($throttleKey, self::LOCKOUT_SECONDS);
                Log::warning('Failed login attempt', [
                    'identifier' => $validated['identifier'],
                    'ip'         => $request->ip(),
                ]);
                return response()->json([
                    'status'  => 'error',
                    'message' => 'Invalid credentials.',
                ], Response::HTTP_UNAUTHORIZED);
            }

            // 5) Clear throttle on success
            RateLimiter::clear($throttleKey);

            // 6) Generate a short‑lived access token (Sanctum)
            $expiresAt = $request->boolean('remember_me')
                ? now()->addDays(30)
                : now()->addHours(2);

            $tokenResult = $user->createToken('auth_token');
            $token      = $tokenResult->plainTextToken;

            // Manually set the expiry on the token record:
            // $tokenResult->accessToken->update(['expires_at' => $expiresAt]);

            // 7) Update user status & last_login
            $user->update([
                'StatutUT'      => 'online',
                'last_login_at' => now(),
            ]);

            Log::info('User logged in', [
                'MatriculeUT' => $user->MatriculeUT,
                'ip'          => $request->ip(),
            ]);

            // 8) Build response
            $response = response()->json([
                'status'       => 'success',
                'message'      => $user->must_change_password ? 'must_change_password' : 'Login successful.',
                'data'         => [
                    'matricule'    => $user->MatriculeUT,
                    'role'         => $user->RoleUT,
                    'UserNameUT'         => $user->UserNameUT,
                    'CodeVerificationUT' => $user->CodeVerificationUT,
                    'access_token' => $token,
                    'token_type'   => self::TOKEN_TYPE,
                    'expires_at'   => $expiresAt->toDateTimeString(),
                ],
            ], Response::HTTP_OK);

            // 9) Issue refresh token cookie (HttpOnly, Secure, SameSite)
            $refreshTtl = $request->boolean('remember_me')
                ? 60 * 60 * 24 * 30   // 30 days
                : 60 * 60 * 24 * 7;   // 7 days

            $response->cookie(
                'refresh_token',
                Str::random(64),    // you should persist this server‑side if you implement a refresh flow
                $refreshTtl,
                '/',
                null,
                true,               // Secure
                true,               // HttpOnly
                false,
                'Strict'            // SameSite
            );

            return $response;

        } catch (ValidationException $e) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Validation failed.',
                'errors'  => $e->errors(),
            ], Response::HTTP_UNPROCESSABLE_ENTITY);

        } catch (Exception $e) {
            Log::error('Login exception', ['error' => $e->getMessage()]);
            return response()->json([
                'status'  => 'error',
                'message' => 'An unexpected error occurred. Please try again later.',
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
            $request->user()->update([
                'StatutUT' => 'offline',
            ]);
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
     * Send password reset link via email, username or phone
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function sendPasswordResetLink(Request $request): JsonResponse
    {
        $identifier = (string) $request->input('identifier', '');
        $code = (string) $request->input('CodeVerificationUT', '');
        $throttleKey = 'pwreset-check|' . Str::slug(Str::lower($identifier)) . '|' . $request->ip();

        if (RateLimiter::tooManyAttempts($throttleKey, self::MAX_PASSWORD_RESET_ATTEMPTS)) {
            $seconds = RateLimiter::availableIn($throttleKey);
            return response()->json([
                'status'  => 'error',
                'message' => "Too many attempts. Try again in {$seconds} seconds.",
            ], Response::HTTP_TOO_MANY_REQUESTS);
        }

        try {
            $validated = $request->validate([
                'identifier' => ['required', 'string',
                    function ($attr, $value, $fail) {
                        if (
                            !filter_var($value, FILTER_VALIDATE_EMAIL) &&
                            !preg_match('/^\\+?[1-9]\\d{1,14}$/', $value) &&
                            !preg_match('/^[a-zA-Z0-9_]{3,}$/', $value)
                        ) {
                            $fail('Identifier must be a valid email, phone number, or username.');
                        }
                    }
                ],
                'CodeVerificationUT' => ['required', 'string'],
            ]);

            RateLimiter::hit($throttleKey, self::PASSWORD_RESET_THROTTLE_SECONDS);

            if (filter_var($validated['identifier'], FILTER_VALIDATE_EMAIL)) {
                $field = 'EmailUT';
            } elseif (preg_match('/^\+?[1-9]\d{1,14}$/', $validated['identifier'])) {
                $field = 'PhoneUT';
            } else {
                $field = 'UserNameUT';
            }

            $user = User::where($field, $validated['identifier'])->first();
            if (!$user) {
                return response()->json([
                    'status'  => 'error',
                    'message' => 'Invalid identifier or verification code. 1',
                ], Response::HTTP_UNAUTHORIZED);
            }
            
            try {
                $decryptedCode = $this->checkIfEncrypted($user->CodeVerificationUT)["value"];
                $decryptedCodeValidation = $this->checkIfEncrypted($validated["CodeVerificationUT"])["value"];
                if ($decryptedCode !== $decryptedCodeValidation) {
                    return response()->json([
                        'status'  => 'error',
                        'message' => 'Invalid identifier or verification code.',
                    ], Response::HTTP_UNAUTHORIZED);
                }
            } catch (\Exception $e) {
                return response()->json([
                    'status'  => 'error',
                    'message' => 'Invalid or corrupted verification code.',
                ], Response::HTTP_UNAUTHORIZED);
            }

            return response()->json([
                'status'  => 'success',
                'message' => 'Verification code is valid. You may now reset your password.',
                "data"    => $user
            ], Response::HTTP_OK);

        } catch (ValidationException $e) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Validation failed',
                'errors'  => $e->errors(),
            ], Response::HTTP_UNPROCESSABLE_ENTITY);

        } catch (Exception $e) {
            Log::error('Validation code check error: ' . $e->getMessage(), ['identifier' => $identifier]);
            return response()->json([
                'status'  => 'error',
                'message' => 'An unexpected error occurred',
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

/**
 * Reset password using verification code
 *
 * @param Request $request
 * @return JsonResponse
 */
public function resetPassword(Request $request): JsonResponse
{
    $identifier = (string) $request->input('identifier', default: '');
    $throttleKey = 'pwreset-confirm|' . Str::slug(Str::lower($identifier)) . '|' . $request->ip();

    if (RateLimiter::tooManyAttempts($throttleKey, self::MAX_PASSWORD_RESET_ATTEMPTS)) {
        $seconds = RateLimiter::availableIn($throttleKey);
        return response()->json([
            'status'  => 'error',
            'message' => "Too many reset attempts. Try again in {$seconds} seconds.",
        ], Response::HTTP_TOO_MANY_REQUESTS);
    }

    try {
        $validated = $request->validate([
            'identifier'             => ['required', 'string', function ($attr, $value, $fail) {
                if (
                    !filter_var($value, FILTER_VALIDATE_EMAIL) &&
                    !preg_match('/^\+?[1-9]\d{1,14}$/', $value) &&
                    !preg_match('/^[a-zA-Z0-9_]{3,}$/', $value)
                ) {
                    $fail('Identifier must be a valid email, phone number, or username.');
                }
            }],
            'CodeVerificationUT'     => 'required|string',
            'PasswordUT'             => 'required|string|min:8',
            'PasswordUT_confirmation' => 'required|same:PasswordUT',
            'TypeUT'                   => 'string'
        ]);

        RateLimiter::hit($throttleKey, self::PASSWORD_RESET_THROTTLE_SECONDS);

        // Determine the field
        if (filter_var($validated['identifier'], FILTER_VALIDATE_EMAIL)) {
            $field = 'EmailUT';
        } elseif (preg_match('/^\+?[1-9]\d{1,14}$/', $validated['identifier'])) {
            $field = 'PhoneUT';
        } else {
            $field = 'UserNameUT';
        }

        $user = User::where($field, $validated['identifier'])->first();
        if (!$user) {
            return response()->json([
                'status'  => 'error',
                'message' => 'User not found.',
            ], Response::HTTP_NOT_FOUND);
        }

        // Verify the code
        try {
            $decryptedCode = $this->checkIfEncrypted($user->CodeVerificationUT)["value"];
            $decryptedCodeValidation = $this->checkIfEncrypted($validated["CodeVerificationUT"])["value"];
            if(array_key_exists('TypeUT', $validated) && in_array($validated['TypeUT'], ['sms', 'email'])) {
                $cacheKey = 'verification_code|' . $validated['identifier'];
                $cachedCode = Cache::get($cacheKey);
                $decryptedCode = $cachedCode; 
            }
            Log::info("Decrypted code: $decryptedCode - Decrypted code validation: $decryptedCodeValidation");
            if ($decryptedCode !== $decryptedCodeValidation) {
                return response()->json([
                    'status'  => 'error',
                    'message' => 'Invalid verification code.',
                ], Response::HTTP_UNAUTHORIZED);
            }
        } catch (\Exception $e) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Invalid or corrupted verification code.',
            ], Response::HTTP_UNAUTHORIZED);
        }
        $firstLogin=$user->must_change_password;
        // Update the password and clear the verification code
        $plainCode = Str::random(27);
        $encryptedCode = Crypt::encryptString($plainCode);
        if($firstLogin){
            $user->update([
                'PasswordUT'         => Hash::make($validated['PasswordUT']),
                'CodeVerificationUT' => $encryptedCode, // Clear after use
                'must_change_password' => false
            ]);
        }else if(array_key_exists('TypeUT', $validated) && in_array($validated['TypeUT'], ['sms', 'email'])) {
            $user->update([
                'PasswordUT' => Hash::make($validated['PasswordUT']),
            ]);

        }else{
            $user->update([
                'PasswordUT'         => Hash::make($validated['PasswordUT']),
                'CodeVerificationUT' => $encryptedCode, // Clear after use
            ]);
        }

        Log::info('Password reset successful', ['identifier' => $identifier, 'ip' => $request->ip()]);
        return response()->json([
            'status'  => 'success',
            'message' => $firstLogin ?  'is first login' :'Password reset successfully',
        ], Response::HTTP_OK);

    } catch (ValidationException $e) {
        return response()->json([
            'status'  => 'error',
            'message' => 'Validation failed',
            'errors'  => $e->errors(),
        ], Response::HTTP_UNPROCESSABLE_ENTITY);

    } catch (Exception $e) {
        Log::error('Password reset error: ' . $e->getMessage(), ['identifier' => $identifier]);
        return response()->json([
            'status'  => 'error',
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
                'NomPL' => 'sometimes|string|max:255',
                'PrenomPL' => 'sometimes|string|max:255',
                'EmailUT' => ['sometimes', 'string', 'email', 'max:255', Rule::unique('users', 'EmailUT')->ignore($user->id)],
                'UserNameUT' => ['sometimes', 'string', 'max:255', Rule::unique('users', 'UserNameUT')->ignore($user->id)],
                'PhoneUT' => 'nullable|string|max:20',
                'PasswordUT' => 'required_with:NewPasswordUT|string',
                'NewPasswordUT' => 'sometimes|string|min:8|confirmed',
            ];

            $validatedData = $request->validate($updateRules);

            // Handle password change
            if (!empty($validatedData['new_password'])) {
                if (!Hash::check($validatedData['current_password'], $user->PasswordUT)) {
                    return response()->json([
                        'status' => 'error',
                        'message' => 'Current password does not match',
                    ], Response::HTTP_UNPROCESSABLE_ENTITY);
                }
                $validatedData['PasswordUT'] = Hash::make($validatedData['new_password']);
            }

            // Remove password fields
            unset($validatedData['PasswordUT'], $validatedData['NewPasswordUT'], $validatedData['NewPasswordUT']);

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
    /**
 * Check user by identifier and return user data
 *
 * @param Request $request The request containing the identifier
 * @return JsonResponse The response containing the user data if found
 */
public function checkUserByIdentifier(Request $request): JsonResponse
{
    try {
        // Validate the input
        $validated = $request->validate([
            'identifier' => [
                'required', 'string',
                function ($attr, $value, $fail) {
                    if (
                        !filter_var($value, FILTER_VALIDATE_EMAIL) &&
                        !preg_match('/^\+?[1-9]\d{1,14}$/', $value) &&
                        !preg_match('/^[a-zA-Z0-9_]{3,}$/', $value)
                    ) {
                        $fail('Identifier must be a valid email, phone number, or username.');
                    }
                },
            ],
        ]);

        // Determine which column to query based on the identifier format
        if (filter_var($validated['identifier'], FILTER_VALIDATE_EMAIL)) {
            $field = 'EmailUT';
        } elseif (preg_match('/^\+?[1-9]\d{1,14}$/', $validated['identifier'])) {
            $field = 'PhoneUT';
        } else {
            $field = 'UserNameUT';
        }

        // Fetch the user from the database
        $user = User::where($field, $validated['identifier'])->first();
        if (!$user) {
            return response()->json([
                'status'  => 'error',
                'message' => 'User not found.',
            ], Response::HTTP_NOT_FOUND);
        }

        // Return the user data
        return response()->json([
            'status'  => 'success',
            'message' => 'User found.',
            'data'    => $user,
        ], Response::HTTP_OK);

    } catch (ValidationException $e) {
        return response()->json([
            'status'  => 'error',
            'message' => 'Validation failed.',
            'errors'  => $e->errors(),
        ], Response::HTTP_UNPROCESSABLE_ENTITY);

    } catch (Exception $e) {
        Log::error('Check user by identifier error: ' . $e->getMessage());
        return response()->json([
            'status'  => 'error',
            'message' => 'An unexpected error occurred. Please try again later.',
        ], Response::HTTP_INTERNAL_SERVER_ERROR);
    }
}
public function sendCodeViaSms(Request $request): JsonResponse
{
    $phone = (string) $request->input('phone', '');
    $throttleKey = 'sms_code|' . Str::slug(Str::lower($phone)) . '|' . $request->ip();
    
    // Rate limit check: max 5 attempts per hour
    if (RateLimiter::tooManyAttempts($throttleKey, 10)) {
        $seconds = RateLimiter::availableIn($throttleKey);
        return response()->json([
            'status'  => 'error',
            'message' => "Too many attempts. Try again in {$seconds} seconds.",
        ], 429);
    }

    try {
        // Validate phone number format
        $validated = $request->validate([
            'phone' => ['required', 'string', 'regex:/^\+?[1-9]\d{1,14}$/'],
        ]);
        
        // Increment the rate limiter (valid for 1 hour)
        RateLimiter::hit($throttleKey, 3600);

        // Generate verification code
        $code = $this->generateVerificationCode();

        // Send the SMS via Twilio
        $twilio = new Client(config('services.twilio.sid'), config('services.twilio.token'));
        $twilio->messages->create(
            $validated['phone'],
            [
                'from' => config('services.twilio.from'),
                'body' => "Your verification code is: {$code}",
            ]
        );
        $cacheKey = 'verification_code|' . $validated['phone'];
        Cache::put($cacheKey, $code, now()->addMinutes(15));

        Log::info('SMS verification code sent', ['phone' => $validated['phone']]);

        return response()->json([
            'status'  => 'success',
            'message' => 'Verification code sent via SMS.',
            'code'    => app()->environment('local') ? $code : null, // exposed only in local environment
        ], 200);

    } catch (ValidationException $e) {
        return response()->json([
            'status'  => 'error',
            'message' => 'Validation failed.',
            'errors'  => $e->errors(),
        ], 422);

    } catch (Exception $e) {
        Log::error('SMS sending error: ' . $e->getMessage(), ['phone' => $phone]);
        return response()->json([
            'status'  => 'error',
            'message' => 'Failed to send SMS. Please try again later.',
            'details' => app()->environment('local') ? $e->getMessage() : null, // show error in local only
        ], 500);
    }
}

public function sendCodeViaEmail(Request $request): JsonResponse
{
    $email = (string) $request->input('email', '');
    Log::info('Email received before validation: ' . $email);

    $throttleKey = 'email_code|' . Str::slug(Str::lower($email)) . '|' . $request->ip();

    if (RateLimiter::tooManyAttempts($throttleKey, 10)) {
        $seconds = RateLimiter::availableIn($throttleKey);
        return response()->json([
            'status'  => 'error',
            'message' => "Too many attempts. Try again in {$seconds} seconds.",
        ], 429);
    }

    try {
        // Validate input and extract the validated email directly
        $validatedEmail = $request->validate([
            'email' => ['required', 'string', 'email'],
        ])['email'];
        Log::info('Email after validation: ' . $validatedEmail);

        RateLimiter::hit($throttleKey, 3600); // 1 hour

        $code = $this->generateVerificationCode();

        Mail::raw("Your verification code is: {$code}", function ($message) use ($validatedEmail) {
            $message->to($validatedEmail)
                    ->subject('Verification Code');
        });

        Log::info('Email verification code sent', ['email' => $validatedEmail]);

        $cacheKey = 'verification_code|' . $validatedEmail;
        Cache::put($cacheKey, $code, now()->addMinutes(15));

        return response()->json([
            'status'  => 'success',
            'message' => 'Verification code sent via email.',
            'code'    => app()->environment('local') ? $code : null,
        ], 200);

    } catch (ValidationException $e) {
        return response()->json([
            'status'  => 'error',
            'message' => 'Validation failed.',
            'errors'  => $e->errors(),
        ], 422);

    } catch (Exception $e) {
        // Don't log array offset access anymore — just the exception message
        Log::error('Email sending error: ' . $e->getMessage(), [
            'email' => $email,
            'trace' => $e->getTraceAsString()
        ]);

        return response()->json([
            'status'  => 'error',
            'message' => 'Failed to send email. Please try again later.',
        ], 500);
    }
}


public function verifyCode(Request $request): JsonResponse
{
    $validated = $request->validate([
        'identifier' => 'required|string', // email or phone
        'code' => 'required|string',
    ]);

    $cacheKey = 'verification_code|' . $validated['identifier'];
    $cachedCode = Cache::get($cacheKey);

    if (!$cachedCode) {
        return response()->json([
            'status'  => 'error',
            'message' => 'Verification code expired or not found.',
        ], 404);
    }

    if ($validated['code'] !== $cachedCode) {
        return response()->json([
            'status'  => 'error',
            'message' => 'Invalid verification code.',
        ], 400);
    }

    return response()->json([
        'status'  => 'success',
        'message' => 'Verification successful.',
    ]);
}


    /**
     * Generate a verification code
     *
     * @return string The generated verification code
     */
    protected function generateVerificationCode(): string
    {
        // Generate a random 6-digit numeric code
        return str_pad(mt_rand(0, 99999999), 8, '0', STR_PAD_LEFT);
    }

    /**
     * Upload user profile image
     *
     * @param Request $request The request containing the profile image
     * @return JsonResponse The response containing the updated profile image URL
     */
    public function uploadProfileImage(Request $request): JsonResponse
    {
        try {
            // Validate the request
            $request->validate([
                'profileImage' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
            ]);

            $user = $request->user();

            // Handle the file upload
            if ($request->hasFile('profileImage')) {
                $file = $request->file('profileImage');
                $fileName = $user->MatriculeUT . '_' . time() . '.' . $file->getClientOriginalExtension();
                
                // Store the file in the public storage
                $path = $file->storeAs('profile-images', $fileName, 'public');
                
                // Update the user's profile image field
                $user->profile_image = '/storage/' . $path;
                $user->save();

                return response()->json([
                    'status' => 'success',
                    'message' => 'Profile image uploaded successfully',
                    'profileImage' => $user->profile_image
                ], Response::HTTP_OK);
            }

            return response()->json([
                'status' => 'error',
                'message' => 'No image file provided'
            ], Response::HTTP_BAD_REQUEST);
        } catch (Exception $e) {
            Log::error('Error uploading profile image', [
                'error' => $e->getMessage(),
                'user_id' => $request->user()->MatriculeUT
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Failed to upload profile image',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Change user password
     *
     * @param Request $request The request containing current and new password
     * @return JsonResponse The response indicating success or failure
     */
    public function changePassword(Request $request): JsonResponse
    {
        try {
            // Validate the request
            $validated = $request->validate([
                'currentPassword' => 'required|string',
                'newPassword' => 'required|string|min:8|different:currentPassword',
                'confirmPassword' => 'required|string|same:newPassword',
            ]);

            $user = $request->user();

            // Check if current password is correct
            if (!Hash::check($validated['currentPassword'], $user->PasswordUT)) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Current password is incorrect'
                ], Response::HTTP_UNAUTHORIZED);
            }

            // Update the password
            $user->PasswordUT = Hash::make($validated['newPassword']);
            $user->password_changed_at = now();
            $user->must_change_password = false;
            $user->save();

            return response()->json([
                'status' => 'success',
                'message' => 'Password changed successfully'
            ], Response::HTTP_OK);
        } catch (ValidationException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation error',
                'errors' => $e->errors()
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        } catch (Exception $e) {
            Log::error('Error changing password', [
                'error' => $e->getMessage(),
                'user_id' => $request->user()->MatriculeUT
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Failed to change password',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
