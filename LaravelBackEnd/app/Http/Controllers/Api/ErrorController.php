<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Illuminate\Validation\ValidationException;
use Exception;
use Illuminate\Support\Facades\Log;

/**
 * Error Controller
 *
 * Provides standardized error handling for the API
 */
class ErrorController extends Controller
{
    /**
     * Standard error codes
     */
    public const ERROR_CODES = [
        // Authentication errors
        'AUTH_INVALID_CREDENTIALS' => 'Invalid credentials',
        'AUTH_USER_NOT_FOUND' => 'User not found',
        'AUTH_INVALID_PASSWORD' => 'Invalid password',
        'AUTH_TOO_MANY_ATTEMPTS' => 'Too many login attempts',
        'AUTH_TOKEN_INVALID' => 'Token is invalid',
        'AUTH_TOKEN_EXPIRED' => 'Token has expired',
        'AUTH_UNAUTHORIZED' => 'Unauthorized access',
        'AUTH_FORBIDDEN' => 'Forbidden',

        // Validation errors
        'VALIDATION_FAILED' => 'Validation failed',
        'VALIDATION_USERNAME_REQUIRED' => 'The username field is required',
        'VALIDATION_EMAIL_REQUIRED' => 'The email field is required',
        'VALIDATION_PHONE_REQUIRED' => 'The phone field is required',
        'VALIDATION_PASSWORD_REQUIRED' => 'The password field is required',
        'VALIDATION_INVALID_EMAIL' => 'Please enter a valid email address',
        'VALIDATION_INVALID_PHONE' => 'Please enter a valid phone number',

        // Profile errors
        'PROFILE_UPDATE_FAILED' => 'Profile update failed',
        'PROFILE_PASSWORD_MISMATCH' => 'Current password does not match',
        'PROFILE_PASSWORD_RESET_FAILED' => 'Password reset failed',

        // Registration errors
        'REGISTER_USERNAME_EXISTS' => 'Username already exists',
        'REGISTER_EMAIL_EXISTS' => 'Email already exists',
        'REGISTER_PHONE_EXISTS' => 'Phone number already exists',
        'REGISTER_FAILED' => 'Registration failed',

        // Server errors
        'SERVER_ERROR' => 'Server error',
        'SERVER_UNEXPECTED_ERROR' => 'An unexpected error occurred',
        'SERVER_UNAVAILABLE' => 'Service temporarily unavailable',
    ];

    /**
     * Handle validation errors
     *
     * @param ValidationException $e
     * @return JsonResponse
     */
    public static function handleValidationError(ValidationException $e): JsonResponse
    {
        return response()->json([
            'status' => 'error',
            'message' => self::ERROR_CODES['VALIDATION_FAILED'],
            'errors' => $e->errors()
        ], Response::HTTP_UNPROCESSABLE_ENTITY);
    }

    /**
     * Handle authentication errors
     *
     * @param string $errorCode
     * @param int $statusCode
     * @return JsonResponse
     */
    public static function handleAuthError(string $errorCode, int $statusCode = Response::HTTP_UNAUTHORIZED): JsonResponse
    {
        $message = self::ERROR_CODES[$errorCode] ?? 'Authentication error';

        return response()->json([
            'status' => 'error',
            'message' => $message
        ], $statusCode);
    }

    /**
     * Handle server errors
     *
     * @param Exception $e
     * @param string $errorCode
     * @return JsonResponse
     */
    public static function handleServerError(Exception $e, string $errorCode = 'SERVER_UNEXPECTED_ERROR'): JsonResponse
    {
        Log::error($errorCode . ': ' . $e->getMessage());

        return response()->json([
            'status' => 'error',
            'message' => self::ERROR_CODES[$errorCode],
            'error' => $e->getMessage()
        ], Response::HTTP_INTERNAL_SERVER_ERROR);
    }

    /**
     * Handle not found errors
     *
     * @param string $resource
     * @return JsonResponse
     */
    public static function handleNotFoundError(string $resource): JsonResponse
    {
        return response()->json([
            'status' => 'error',
            'message' => $resource . ' not found'
        ], Response::HTTP_NOT_FOUND);
    }

    /**
     * Handle forbidden errors
     *
     * @param string $message
     * @return JsonResponse
     */
    public static function handleForbiddenError(string $message = null): JsonResponse
    {
        return response()->json([
            'status' => 'error',
            'message' => $message ?? self::ERROR_CODES['AUTH_FORBIDDEN']
        ], Response::HTTP_FORBIDDEN);
    }
}
