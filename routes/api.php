<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PendaftaranController;
use App\Http\Controllers\JenjangController;
use App\Http\Controllers\JurusanController;
use App\Http\Controllers\EkstrakurikulerController; // Tambahkan ini
use App\Models\Ekstrakurikuler;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/
Route::post('auth/register', [AuthController::class, 'register']);
Route::post('auth/login', [AuthController::class, 'login']);
Route::post('pendaftaran', [PendaftaranController::class, 'store']); 

// Public Lookup - Semua pendaftar bisa melihat list ini
Route::get('jenjangs', [JenjangController::class, 'index']);
Route::get('jurusans', [JurusanController::class, 'index']);
Route::get('ekstrakurikulers', [EkstrakurikulerController::class, 'index']); // Diubah menjadi Controller

/*
|--------------------------------------------------------------------------
| Protected Routes (Auth Sanctum)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {
    Route::post('auth/logout', [AuthController::class, 'logout']);
    Route::get('auth/me', [AuthController::class, 'me']);

    Route::get('pendaftars', [PendaftaranController::class, 'index']);
    Route::get('pendaftars/{pendaftar}', [PendaftaranController::class, 'show']);

    /*
    | Admin Only
    */
    Route::middleware(\App\Http\Middleware\EnsureUserIsAdmin::class)->group(function () {
        // CRUD Master Data oleh Admin (Sama seperti Jenjang & Jurusan)
        Route::apiResource('jenjangs', JenjangController::class)->except(['index', 'show']);
        Route::apiResource('jurusans', JurusanController::class)->except(['index', 'show']);
        Route::apiResource('ekstrakurikulers', EkstrakurikulerController::class)->except(['index', 'show']); // Penambahan CRUD Ekskul

        Route::post('pendaftars/{pendaftar}/approve', [PendaftaranController::class, 'approve']);
        Route::post('pendaftars/{pendaftar}/reject', [PendaftaranController::class, 'reject']);
    });
});