<?php

namespace App\Http\Controllers;

use App\Models\Jenjang;
use Illuminate\Http\Request;
use App\Http\Resources\JenjangResource;

class JenjangController extends Controller
{
    public function index()
    {
        return JenjangResource::collection(Jenjang::orderBy('name')->get());
    }

    public function show(Jenjang $jenjang)
    {
        return new JenjangResource($jenjang);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:jenjangs,name'],
        ]);

        $jenjang = Jenjang::create($data);

        return new JenjangResource($jenjang);
    }

    public function update(Request $request, Jenjang $jenjang)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:jenjangs,name,' . $jenjang->id],
        ]);

        $jenjang->update($data);

        return new JenjangResource($jenjang);
    }

    public function destroy(Jenjang $jenjang)
    {
        $jenjang->delete();

        return response()->json(['message' => 'Deleted']);
    }
}
