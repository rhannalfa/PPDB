<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PendaftaranController;
use App\Http\Controllers\JenjangController;
use App\Http\Controllers\JurusanController;


Route::post('auth/register', [AuthController::class, 'register']);
Route::post('auth/login', [AuthController::class, 'login']);
Route::post('pendaftaran', [PendaftaranController::class, 'store']); // publik

Route::middleware('auth:sanctum')->group(function () {
    Route::post('auth/logout', [AuthController::class, 'logout']);
    Route::get('auth/me', [AuthController::class, 'me']);

    // Pendaftar management
    Route::get('pendaftars', [PendaftaranController::class, 'index']);
    Route::get('pendaftars/{pendaftar}', [PendaftaranController::class, 'show']);

    // Admin protected resources
    Route::middleware('admin')->group(function () {
        Route::apiResource('jenjangs', JenjangController::class)->only(['index', 'show', 'store', 'update', 'destroy']);
        Route::apiResource('jurusans', JurusanController::class)->only(['index', 'show', 'store', 'update', 'destroy']);

        // Approve / reject actions for pendaftars
        Route::post('pendaftars/{pendaftar}/approve', [PendaftaranController::class, 'approve']);
        Route::post('pendaftars/{pendaftar}/reject', [PendaftaranController::class, 'reject']);
    });
});
