<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Import Refactored Controllers
use App\Http\Controllers\Api\AuthController; // Still needed for /user route
use App\Http\Controllers\Api\NiveauController;
use App\Http\Controllers\Api\MatiereController;
use App\Http\Controllers\Api\EvaluationTypeController;
use App\Http\Controllers\Api\ProfesseurController;
use App\Http\Controllers\Api\GroupController;
use App\Http\Controllers\Api\EtudiantController;
use App\Http\Controllers\Api\AttendanceController;
use App\Http\Controllers\Api\TeacherVocationController;
use App\Http\Controllers\Api\EvaluationController;
use App\Http\Controllers\Api\NoteController;
use App\Http\Controllers\Api\NoteFinalController;
use App\Http\Controllers\Api\EvaluationResultController;
use App\Http\Controllers\Api\AcademicYearController;
use App\Http\Controllers\Api\SchoolCalendarController;
use App\Http\Controllers\Api\HolidayController;
use App\Http\Controllers\Api\SalleController;
use App\Http\Controllers\Api\DayWeekController;
use App\Http\Controllers\Api\TimeSlotController;
use App\Http\Controllers\Api\RegularTimeTableController;
use App\Http\Controllers\Api\SchoolEventController;
use App\Http\Controllers\Api\SpecialDayScheduleController;
use App\Http\Controllers\Api\TimeTableExceptionController;
use App\Http\Controllers\Api\GradeAdjustmentController;
use App\Http\Controllers\Api\UserController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// --- Include Authentication Routes ---
// This will register the routes defined in auth.php under the /api prefix
require __DIR__.'/auth.php';

// Authentication routes are typically in routes/auth.php or included here

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
})->name('api.current_user'); // Renamed from api.user to avoid conflict if auth.php is separate

// User profile routes
Route::middleware('auth:sanctum')->group(function () {
    // Profile routes
    Route::get('/users/profile', [AuthController::class, 'user'])->name('api.profile.get');
    Route::put('/users/profile', [AuthController::class, 'updateProfile'])->name('api.profile.update');
    Route::post('/users/upload-profile-image', [AuthController::class, 'uploadProfileImage'])->name('api.profile.upload_image');
    Route::post('/users/change-password', [AuthController::class, 'changePassword'])->name('api.profile.change_password');

    // --- Add Paginate and Count Routes for Resources ---
    $resourceControllers = [
        'niveaux' => NiveauController::class,
        'matieres' => MatiereController::class,
        'evaluation-types' => EvaluationTypeController::class,
        'professeurs' => ProfesseurController::class,
        'groups' => GroupController::class,
        'etudiants' => EtudiantController::class,
        'attendances' => AttendanceController::class,
        'teacher-vocations' => TeacherVocationController::class,
        'evaluations' => EvaluationController::class,
        'notes' => NoteController::class,
        'note-finals' => NoteFinalController::class,
        'evaluation-results' => EvaluationResultController::class,
        'academic-years' => AcademicYearController::class,
        'school-calendars' => SchoolCalendarController::class,
        'holidays' => HolidayController::class,
        'salles' => SalleController::class,
        'day-weeks' => DayWeekController::class,
        'time-slots' => TimeSlotController::class,
        'regular-timetables' => RegularTimeTableController::class,
        'school-events' => SchoolEventController::class,
        'special-day-schedules' => SpecialDayScheduleController::class,
        'timetable-exceptions' => TimeTableExceptionController::class,
        'grade-adjustments' => GradeAdjustmentController::class,
        // Add other controllers here if they use CrudOperations and need these routes
    ];

    foreach ($resourceControllers as $resource => $controller) {
        Route::get("/{$resource}/count", [$controller, 'count'])->name("{$resource}.count");
        Route::apiResource($resource, $controller);
    }

    // Note: Protected routes from auth.php (like /logout) are already defined
    // with the 'auth:sanctum' middleware within the auth.php file itself.

});

// Add OPTIONS route handler for CORS preflight requests
Route::options('/{any}', function () {
    return response()->json([], 200)
        ->header('Access-Control-Allow-Origin', 'http://localhost:5173')
        ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        ->header('Access-Control-Allow-Credentials', 'true');
})->where('any', '.*');
