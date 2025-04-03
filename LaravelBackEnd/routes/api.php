<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\EtudiantController;
use App\Http\Controllers\Api\ProfesseurController;
use App\Http\Controllers\Api\GroupeController;
use App\Http\Controllers\Api\MatiereController;
use App\Http\Controllers\Api\SalleController;
use App\Http\Controllers\Api\PeriodeController;
use App\Http\Controllers\Api\InscriptionController;
use App\Http\Controllers\Api\AffectationController;
use App\Http\Controllers\Api\EvaluationController;
use App\Http\Controllers\Api\NoteController;
use App\Http\Controllers\Api\EvaluationResultController;
use App\Http\Controllers\Api\EmploiDuTempsController;
use App\Http\Controllers\Api\AbsenceController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Public routes
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth.api')->group(function () {
    // Auth routes
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/refresh-token', [AuthController::class, 'refreshToken']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('/reset-password', [AuthController::class, 'resetPassword']);
    Route::get('/user/me', [AuthController::class, 'me']);

    // Dashboard routes
    Route::get('/dashboard/admin', [DashboardController::class, 'adminDashboard']);
    Route::get('/dashboard/statistics', [DashboardController::class, 'getStatistics']);
    Route::get('/dashboard/performance-metrics', [DashboardController::class, 'getPerformanceMetrics']);
    Route::get('/dashboard/student/{studentId}', [DashboardController::class, 'studentDashboard']);
    Route::get('/dashboard/professor/{professorId}', [DashboardController::class, 'professorDashboard']);
    Route::get('/dashboard/attendance/{role}/{userId}', [DashboardController::class, 'getAttendance']);
    Route::get('/dashboard/performance/{role}/{userId}', [DashboardController::class, 'getPerformance']);
    Route::get('/dashboard/events/{role}/{userId}', [DashboardController::class, 'getEvents']);
    Route::post('/dashboard/attendance/submit', [DashboardController::class, 'submitAttendance']);
    Route::post('/dashboard/grades/submit', [DashboardController::class, 'submitGrades']);
    Route::post('/dashboard/events', [DashboardController::class, 'createEvent']);

    // Resource routes
    $controllers = [
        'etudiants' => EtudiantController::class,
        'professeurs' => ProfesseurController::class,
        'groupes' => GroupeController::class,
        'matieres' => MatiereController::class,
        'salles' => SalleController::class,
        'periodes' => PeriodeController::class,
        'inscriptions' => InscriptionController::class,
        'affectations' => AffectationController::class,
        'evaluations' => EvaluationController::class,
        'notes' => NoteController::class,
        'evaluation-results' => EvaluationResultController::class,
        'emploi-du-temps' => EmploiDuTempsController::class,
        'absences' => AbsenceController::class,
    ];

    foreach ($controllers as $resource => $controller) {
        Route::prefix($resource)->group(function () use ($controller) {
            Route::get('/paginate', [$controller, 'paginate']);
            Route::get('/index', [$controller, 'index']);
            Route::get('/count', [$controller, 'count']);
            Route::post('/', [$controller, 'store']);
            Route::get('/{matricule}', [$controller, 'show']);
            Route::put('/{matricule}', [$controller, 'update']);
            Route::delete('/{matricule}', [$controller, 'destroy']);
        });
    }

    // Additional specific routes
    // Notes routes
    Route::prefix('notes')->group(function () {
        Route::get('/student/{etudiantId}', [NoteController::class, 'getStudentNotes']);
        Route::get('/subject/{matiereId}', [NoteController::class, 'getSubjectNotes']);
    });

    // Evaluation Results routes
    Route::prefix('evaluation-results')->group(function () {
        Route::get('/student/{etudiantId}', [EvaluationResultController::class, 'getStudentResults']);
        Route::get('/evaluation/{evaluationId}', [EvaluationResultController::class, 'getEvaluationResults']);
    });
});
