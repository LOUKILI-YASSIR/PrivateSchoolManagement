<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\EtudiantController;
use App\Http\Controllers\ProfesseurController;
use App\Http\Controllers\UserController;

    // Student Routes (Etudiants)
    Route::prefix('etudiants')->group(function () {
        Route::get('/{start}/{length}', [EtudiantController::class, 'paginated'])->name('etudiants.paginated');;
        Route::get('/', [EtudiantController::class, 'index'])->name('etudiants.index'); // List all students
        Route::get('/count', [EtudiantController::class, 'count'])->name('etudiants.count'); // Count Of all students
        Route::post('/', [EtudiantController::class, 'store'])->name('etudiants.store'); // Add a new student
        Route::get('/{matriculeEt}', [EtudiantController::class, 'show'])->name('etudiants.show'); // Get a specific student
        Route::put('/{matriculeEt}', [EtudiantController::class, 'update'])->name('etudiants.update'); // Update student details
        Route::delete('/{matriculeEt}', [EtudiantController::class, 'destroy'])->name('etudiants.destroy'); // Delete a student
    });

// Professor Routes (Professeurs)
Route::prefix('professeurs')->group(function () {
    Route::get('/', [ProfesseurController::class, 'index'])->name('professeurs.index'); // List all professors
    Route::get('/count', [ProfesseurController::class, 'count'])->name('professeurs.count');
    Route::get('/{matriculePr}', [ProfesseurController::class, 'show'])->name('professeurs.show'); // Get a single professor by matriculePr
    Route::post('/', [ProfesseurController::class, 'store'])->name('professeurs.store'); // Create a new professor
    Route::put('/{matriculePr}', [ProfesseurController::class, 'update'])->name('professeurs.update'); // Update professor details
    Route::delete('/{matriculePr}', [ProfesseurController::class, 'destroy'])->name('professeurs.destroy'); // Delete a professor
});

// User Routes (Users)
Route::prefix('users')->group(function () {
    Route::get('/', [UserController::class, 'index'])->name('users.index'); // List all users
    Route::get('/count', [UserController::class, 'count'])->name('users.count');
    Route::get('/{matriculeUt}', [UserController::class, 'show'])->name('users.show'); // Get a single user by matriculeUt
    Route::post('/', [UserController::class, 'store'])->name('users.store'); // Create a new user
    Route::put('/{matriculeUt}', [UserController::class, 'update'])->name('users.update'); // Update user details
    Route::delete('/{matriculeUt}', [UserController::class, 'destroy'])->name('users.destroy'); // Delete a user
});
