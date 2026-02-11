<?php

namespace App\Http\Controllers;

use App\Models\Jurusan;
use Illuminate\Http\Request;
use App\Http\Resources\JurusanResource;

class JurusanController extends Controller
{
    public function index()
    {
        return JurusanResource::collection(Jurusan::with('jenjang')->orderBy('name')->get());
    }

    public function show(Jurusan $jurusan)
    {
        return new JurusanResource($jurusan->load('jenjang'));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'jenjang_id' => ['required', 'exists:jenjangs,id'],
            'name' => ['required', 'string', 'max:255'],
        ]);

        $jurusan = Jurusan::create($data);

        return new JurusanResource($jurusan);
    }

    public function update(Request $request, Jurusan $jurusan)
    {
        $data = $request->validate([
            'jenjang_id' => ['required', 'exists:jenjangs,id'],
            'name' => ['required', 'string', 'max:255', 'unique:jurusans,name,' . $jurusan->id],
        ]);

        $jurusan->update($data);

        return new JurusanResource($jurusan);
    }

    public function destroy(Jurusan $jurusan)
    {
        $jurusan->delete();

        return response()->json(['message' => 'Deleted']);
    }
}
