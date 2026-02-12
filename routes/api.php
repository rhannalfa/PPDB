<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PendaftaranController;
use App\Http\Controllers\JenjangController;
use App\Http\Controllers\JurusanController;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/
Route::post('auth/register', [AuthController::class, 'register']);
Route::post('auth/login', [AuthController::class, 'login']);
Route::post('pendaftaran', [PendaftaranController::class, 'store']); 

// Pindahkan ini ke atas agar bisa diakses tanpa login (Public Lookup)
Route::get('jenjangs', [JenjangController::class, 'index']);
Route::get('jurusans', [JurusanController::class, 'index']);


/*
|--------------------------------------------------------------------------
| Protected Routes (Auth Sanctum)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {
    Route::post('auth/logout', [AuthController::class, 'logout']);
    Route::get('auth/me', [AuthController::class, 'me']);

    // Pendaftar management
    Route::get('pendaftars', [PendaftaranController::class, 'index']);
    Route::get('pendaftars/{pendaftar}', [PendaftaranController::class, 'show']);

    /*
    | Admin Only
    */
    Route::middleware(\App\Http\Middleware\EnsureUserIsAdmin::class)->group(function () {
        // Gunakan EXCEPT agar route 'index' dan 'show' tidak menimpa route publik di atas
        Route::apiResource('jenjangs', JenjangController::class)->except(['index', 'show']);
        Route::apiResource('jurusans', JurusanController::class)->except(['index', 'show']);

        Route::post('pendaftars/{pendaftar}/approve', [PendaftaranController::class, 'approve']);
        Route::post('pendaftars/{pendaftar}/reject', [PendaftaranController::class, 'reject']);
    });
});