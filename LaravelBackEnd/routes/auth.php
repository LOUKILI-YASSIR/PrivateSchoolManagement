<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;

/*
|--------------------------------------------------------------------------
| Authentication Routes (API)
|--------------------------------------------------------------------------
|
| Here is where you can register authentication routes for your application.
| These routes handle user registration, login, logout, and token refresh.
|
*/

// Public authentication routes (Prefix with /auth if desired, e.g., /auth/login)
Route::post('/register', [AuthController::class, 'register'])->name('api.register');
Route::post('/login', [AuthController::class, 'login'])->name('api.login');
Route::post('/forgot-password-code-verivication', [AuthController::class, 'sendPasswordResetLink'])->name('api.password.email');
Route::post('/reset-password', [AuthController::class, 'resetPassword'])->name('api.password.update');
Route::post('/check-user', [AuthController::class, 'checkUserByIdentifier']);
Route::post('/send-sms-code', [AuthController::class, 'sendCodeViaSms']);
Route::post('/send-email-code', [AuthController::class, 'sendCodeViaEmail']);
Route::post('/verify-code', [AuthController::class, 'verifyCode']);
Route::post('/setup-2fa', [AuthController::class, 'setupGoogle2FA']);
Route::post('/verify-2fa', [AuthController::class, 'verifyGoogle2FA']);
// Protected authentication routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout'])->name('api.logout');
    // Profile update route - uncommented
    Route::put('/profile', [AuthController::class, 'updateProfile'])->name('api.profile.update');
    Route::post('/refresh-token', [AuthController::class, 'refreshToken'])->name('api.token.refresh');
    // Route::get('/user', [AuthController::class, 'user'])->name('api.user'); // Defined in api.php
    Route::get('/check-token', [AuthController::class, 'checkToken'])->name('api.token.check');
});
