<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PendaftaranController;
use App\Http\Controllers\JenjangController;
use App\Http\Controllers\JurusanController;
use App\Http\Controllers\EkstrakurikulerController;
use App\Http\Controllers\PaymentController;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
| Route yang bisa diakses tanpa login (oleh pendaftar/pengunjung).
*/

// Auth & Registration
Route::post('auth/register', [AuthController::class, 'register']);
Route::post('auth/login', [AuthController::class, 'login']);
Route::post('pendaftaran', [PendaftaranController::class, 'store']);

// Public Lookups (Untuk pilihan di form pendaftaran)
Route::get('jenjangs', [JenjangController::class, 'index']);
Route::get('jurusans', [JurusanController::class, 'index']);
Route::get('ekstrakurikulers', [EkstrakurikulerController::class, 'index']);

// Midtrans Payment Routes
// createToken dibuat publik agar setelah daftar, siswa bisa langsung bayar.
Route::post('/payment/token', [PaymentController::class, 'createToken']);
// Callback HARUS publik karena akan dipanggil oleh server Midtrans.
Route::post('/payment/callback', [PaymentController::class, 'callback']);
Route::get('pendaftaran/cek/{no_pendaftaran}', [PaymentController::class, 'checkStatus']);



/*
|--------------------------------------------------------------------------
| Protected Routes (Auth Sanctum)
|--------------------------------------------------------------------------
| Route yang memerlukan token (Bearer Token) untuk diakses.
*/
Route::middleware('auth:sanctum')->group(function () {

    // User Profile & Session
    Route::post('auth/logout', [AuthController::class, 'logout']);
    Route::get('auth/me', [AuthController::class, 'me']);

    // Data Pendaftaran (Biasanya untuk melihat status sendiri atau dashboard admin)
    Route::get('pendaftars', [PendaftaranController::class, 'index']);
    Route::get('pendaftars/{pendaftar}', [PendaftaranController::class, 'show']);

    /*
    |--------------------------------------------------------------------------
    | Admin Only
    |--------------------------------------------------------------------------
    */
    Route::middleware(\App\Http\Middleware\EnsureUserIsAdmin::class)->group(function () {

        // CRUD Master Data (Punya hak akses penuh: Create, Update, Delete)
        Route::apiResource('jenjangs', JenjangController::class)->except(['index', 'show']);
        Route::apiResource('jurusans', JurusanController::class)->except(['index', 'show']);
        Route::apiResource('ekstrakurikulers', EkstrakurikulerController::class)->except(['index', 'show']);

        // Verifikasi Pendaftaran
        Route::post('pendaftars/{pendaftar}/approve', [PendaftaranController::class, 'approve']);
        Route::post('pendaftars/{pendaftar}/reject', [PendaftaranController::class, 'reject']);
    });
});
