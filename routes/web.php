<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

// SPA catch-all: return the same welcome view for any client-side route
// Exclude paths beginning with 'api' to avoid interfering with API routes
Route::get('{any}', function () {
    return view('welcome');
})->where('any', '^(?!api).*$');
