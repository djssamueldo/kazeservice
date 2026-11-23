<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PropertyController;
use App\Http\Controllers\Api\FormationController;
use App\Http\Controllers\Api\AppointmentController;
use App\Http\Controllers\Api\MessageController;
use App\Http\Controllers\Api\PartnerController;
use App\Http\Controllers\Api\AgencyController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\SettingController;

// Authentification (publiques)
Route::middleware('throttle:5,1')->group(function () {
    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::post('/auth/login', [AuthController::class, 'login']);
    Route::post('/auth/forgot-password', [AuthController::class, 'forgotPassword']);
});
Route::middleware('throttle:10,1')->group(function () {
    Route::post('/auth/reset-password', [AuthController::class, 'resetPassword']);
    Route::post('/auth/check-email', [AuthController::class, 'checkEmail']);
});

// Authentification (requièrent une connexion)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::get('/auth/profile/{id}', [AuthController::class, 'profile']);
    Route::post('/auth/change-password', [AuthController::class, 'changePassword']);
    Route::post('/auth/send-verification-email', [AuthController::class, 'sendVerificationEmail']);
});

// Biens - Lecture publique (pour affichage sur le site)
Route::get('/properties', [PropertyController::class, 'index']);
Route::get('/properties/{id}', [PropertyController::class, 'show']);

// Biens - Modification (requièrent authentification + staff/admin)
Route::middleware(['auth:sanctum', 'staff'])->group(function () {
    Route::post('/properties', [PropertyController::class, 'store']);
    Route::put('/properties/{id}', [PropertyController::class, 'update']);
    Route::delete('/properties/{id}', [PropertyController::class, 'destroy']);
    Route::patch('/properties/{id}/status', [PropertyController::class, 'updateStatus']);
    Route::post('/properties/{id}/images', [PropertyController::class, 'uploadImage']);
    Route::delete('/properties/{id}/images', [PropertyController::class, 'deleteImage']);
});

// Formations - Lecture publique (pour affichage sur le site)
Route::get('/formations', [FormationController::class, 'index']);
Route::get('/formations/{slug}', [FormationController::class, 'show']);

// Formations - Modification (requièrent authentification + staff/admin)
Route::middleware(['auth:sanctum', 'staff'])->group(function () {
    Route::post('/formations', [FormationController::class, 'store']);
    Route::put('/formations/{id}', [FormationController::class, 'update']);
    Route::delete('/formations/{id}', [FormationController::class, 'destroy']);
});

// Rendez-vous - Création publique (visiteurs peuvent prendre RDV)
Route::post('/appointments', [AppointmentController::class, 'store']);

// Rendez-vous - Mes rendez-vous (requièrent authentification, accessible à tous les utilisateurs connectés)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/appointments/my', [AppointmentController::class, 'myAppointments']);
});

// Rendez-vous - Lecture et modification (requièrent authentification + staff/admin)
Route::middleware(['auth:sanctum', 'staff'])->group(function () {
    Route::get('/appointments', [AppointmentController::class, 'index']);
    Route::patch('/appointments/{id}/status', [AppointmentController::class, 'updateStatus']);
});

// Messages - Création publique (visiteurs peuvent envoyer des messages)
Route::post('/messages', [MessageController::class, 'store']);

// Messages - Lecture et modification (requièrent authentification + staff/admin)
Route::middleware(['auth:sanctum', 'staff'])->group(function () {
    Route::get('/messages', [MessageController::class, 'index']);
    Route::patch('/messages/{id}/status', [MessageController::class, 'updateStatus']);
});

// Partenaires - Lecture publique (pour affichage sur le site)
Route::get('/partners', [PartnerController::class, 'index']);

// Partenaires - Modification (requièrent authentification + staff/admin)
Route::middleware(['auth:sanctum', 'staff'])->group(function () {
    Route::get('/partners/all', [PartnerController::class, 'all']);
    Route::post('/partners', [PartnerController::class, 'store']);
    Route::put('/partners/{id}', [PartnerController::class, 'update']);
    Route::patch('/partners/{id}/status', [PartnerController::class, 'updateStatus']);
    Route::delete('/partners/{id}', [PartnerController::class, 'destroy']);
    Route::post('/partners/{id}/logo', [PartnerController::class, 'uploadLogo']);
});

// Agences - Lecture publique (pour affichage sur le site)
Route::get('/agencies', [AgencyController::class, 'index']);

// Agences - Modification (requièrent authentification + staff/admin)
Route::middleware(['auth:sanctum', 'staff'])->group(function () {
    Route::post('/agencies', [AgencyController::class, 'store']);
    Route::put('/agencies/{id}', [AgencyController::class, 'update']);
    Route::delete('/agencies/{id}', [AgencyController::class, 'destroy']);
});

// Profils - Modification (requièrent authentification + staff/admin)
Route::middleware(['auth:sanctum', 'staff'])->group(function () {
    Route::get('/profiles', [ProfileController::class, 'index']);
    Route::patch('/profiles/{id}/permissions', [ProfileController::class, 'updatePermissions']);
});

// Settings - Lecture publique (pour affichage sur le site)
Route::get('/settings', [SettingController::class, 'index']);

// Settings - Modification (requièrent authentification + staff/admin)
Route::middleware(['auth:sanctum', 'staff'])->group(function () {
    Route::put('/settings', [SettingController::class, 'update']);
});
