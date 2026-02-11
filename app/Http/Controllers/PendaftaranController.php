<?php

namespace App\Http\Controllers;

use App\Http\Requests\PendaftaranRequest;
use App\Http\Resources\PendaftarResource;
use App\Services\RegistrationService;
use App\Models\Pendaftar;

class PendaftaranController extends Controller
{
    protected RegistrationService $service;

    public function __construct(RegistrationService $service)
    {
        $this->service = $service;
    }

    // Public registration
    public function store(PendaftaranRequest $request)
    {
        $pendaftar = $this->service->register($request->validated());

        return new PendaftarResource($pendaftar->load(['jenjang', 'jurusan']));
    }

    // Protected: list (with eager loading)
    public function index()
    {
        $list = Pendaftar::with(['jenjang', 'jurusan'])
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return PendaftarResource::collection($list);
    }

    public function show(Pendaftar $pendaftar)
    {
        return new PendaftarResource($pendaftar->load(['jenjang', 'jurusan']));
    }

    // Admin actions
    public function approve(Pendaftar $pendaftar)
    {
        $pendaftar->status_pendaftaran = 'approved';
        $pendaftar->save();

        return new PendaftarResource($pendaftar->load(['jenjang', 'jurusan']));
    }

    public function reject(Pendaftar $pendaftar)
    {
        $pendaftar->status_pendaftaran = 'rejected';
        $pendaftar->save();

        return new PendaftarResource($pendaftar->load(['jenjang', 'jurusan']));
    }
}
