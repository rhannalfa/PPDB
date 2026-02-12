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
        // 1. Daftarkan siswa melalui Service (Tetap gunakan kode asli kamu)
        $pendaftar = $this->service->register($request->validated());
    
        // 2. Konfigurasi Midtrans
        Config::$serverKey = config('services.midtrans.server_key');
        Config::$isProduction = config('services.midtrans.is_production');
        Config::$isSanitized = true;
        Config::$is3ds = true;
    
        // 3. Siapkan Parameter Transaksi
        $params = [
            'transaction_details' => [
                'order_id' => $pendaftar->no_pendaftaran,
                'gross_amount' => 150000, // Sesuaikan nominal biaya pendaftaran
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
    
            // 5. Simpan token ke database agar bisa dipanggil lagi jika perlu
            $pendaftar->update(['snap_token' => $snapToken]);
    
            // 6. Return Resource dengan tambahan snap_token
            return (new PendaftarResource($pendaftar->load(['jenjang', 'jurusan'])))
                    ->additional(['snap_token' => $snapToken]);
    
        } catch (\Exception $e) {
            return response()->json(['message' => 'Gagal generate pembayaran: ' . $e->getMessage()], 500);
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
}
