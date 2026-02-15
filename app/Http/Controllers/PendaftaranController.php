<?php

namespace App\Http\Controllers;

use App\Http\Requests\PendaftaranRequest;
use App\Http\Resources\PendaftarResource;
use App\Services\RegistrationService;
use App\Models\Pendaftar;
use Illuminate\Http\Request;
use Midtrans\Config;
use Midtrans\Snap;

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
        // 1. Daftarkan siswa melalui Service
        $pendaftar = $this->service->register($request->validated());

        // 2. Konfigurasi Midtrans
        Config::$serverKey = config('services.midtrans.server_key');
        Config::$isProduction = config('services.midtrans.is_production');
        Config::$isSanitized = true;
        Config::$is3ds = true;

        // 3. Order ID Unik (No Pendaftaran + Timestamp)
        $orderId = $pendaftar->no_pendaftaran . '-' . time();

        $params = [
            'transaction_details' => [
                'order_id' => $orderId,
                'gross_amount' => 500000, 
            ],
            'customer_details' => [
                'first_name' => $pendaftar->nama,
                'email' => $pendaftar->email,
                'phone' => $pendaftar->no_hp,
            ],
        ];

        try {
            // 4. Generate Snap Token
            $snapToken = Snap::getSnapToken($params);

            // 5. Simpan token ke database
            // PENTING: Pastikan 'snap_token' sudah ada di $fillable di model Pendaftar
            $pendaftar->update(['snap_token' => $snapToken]);

            // 6. Return Data Lengkap
            // Kita bungkus dalam 'data' agar konsisten dengan PendaftarResource
            return response()->json([
                'message' => 'Pendaftaran berhasil disimpan',
                'data' => [
                    'no_pendaftaran' => $pendaftar->no_pendaftaran,
                    'nama' => $pendaftar->nama,
                    'snap_token' => $snapToken
                ]
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal generate pembayaran: ' . $e->getMessage()
            ], 500);
        }
    }

    // Protected: list (with eager loading)
    public function index(Request $request)
    {
        // If admin requests all records explicitly, return full collection (no pagination)
        $all = (bool) $request->query('all', false);
        $user = $request->user();

        if ($all && $user && ($user->role ?? null) === 'admin') {
            $list = Pendaftar::with(['jenjang', 'jurusan'])
                ->orderBy('created_at', 'desc')
                ->get();

            return PendaftarResource::collection($list);
        }

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

    // PendaftaranController.php
    public function checkStatus(Request $request) {
        $pendaftar = Pendaftar::where('email', $request->email)
                            ->orWhere('no_pendaftaran', $request->no_pendaftaran)
                            ->firstOrFail();

        return new PendaftarResource($pendaftar);
    }
    
}

