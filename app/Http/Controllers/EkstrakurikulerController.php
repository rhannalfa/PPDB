<?php

namespace App\Http\Controllers;

use App\Models\Ekstrakurikuler;
use Illuminate\Http\Request;

class EkstrakurikulerController extends Controller
{
    // Dipakai oleh Form React (Public)
    public function index()
    {
        return response()->json(Ekstrakurikuler::all());
    }

    // Dipakai oleh Admin untuk tambah ekskul
    public function store(Request $request)
    {
        $validated = $request->validate(['nama_ekskul' => 'required|string|unique:ekstrakurikulers']);
        return Ekstrakurikuler::create($validated);
    }

    // Dipakai oleh Admin untuk hapus ekskul
    public function destroy(Ekstrakurikuler $ekstrakurikuler)
    {
        $ekstrakurikuler->delete();
        return response()->json(['message' => 'Ekskul dihapus']);
    }
}