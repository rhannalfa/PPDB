<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Pendaftar;
use Midtrans\Config;
use Midtrans\Snap;
use Illuminate\Support\Facades\Log;

class PaymentController extends Controller
{
    public function __construct()
    {
        Config::$serverKey = config('services.midtrans.server_key');
        Config::$isProduction = config('services.midtrans.is_production');
        Config::$isSanitized = true;
        Config::$is3ds = true;
    }

    public function createToken(Request $request)
    {
        $pendaftar = Pendaftar::findOrFail($request->pendaftar_id);

        // Jika pendaftar sudah punya snap_token dan statusnya masih pending, pakai yang lama saja.
        // Ini mencegah pembuatan transaksi baru di Midtrans jika user hanya refresh halaman.
        if ($pendaftar->snap_token && $pendaftar->status_pembayaran === 'pending') {
            return response()->json(['snap_token' => $pendaftar->snap_token]);
        }

        // Membuat Order ID unik dengan timestamp
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
            'enabled_payments' => ['bank_transfer'],
            'bank_transfer' => [
                'bank' => 'bri' // BRI tersedia langsung
            ]
        ];

        try {
            $snapToken = Snap::getSnapToken($params);

            // Simpan snap_token dan order_id terbaru agar sinkron saat callback
            $pendaftar->update([
                'snap_token' => $snapToken,
                'last_order_id' => $orderId // Disarankan punya kolom ini untuk tracking lebih akurat
            ]);

            return response()->json(['snap_token' => $snapToken]);
        } catch (\Exception $e) {
            Log::error('Midtrans Error: ' . $e->getMessage());
            return response()->json(['message' => 'Gagal membuat token: ' . $e->getMessage()], 500);
        }
    }

    public function checkStatus($no_pendaftaran) {
        $pendaftar = Pendaftar::where('no_pendaftaran', $no_pendaftaran)
            ->with(['jenjang', 'jurusan'])
            ->firstOrFail();

        return response()->json([
            'data' => $pendaftar,
            // Kirimkan snap_token yang sudah tersimpan di database saat register tadi
            'snap_token' => $pendaftar->snap_token
        ]);
    }

    public function callback(Request $request)
    {
        $serverKey = config('services.midtrans.server_key');
        
        // 1. Validasi Signature Key (Keamanan)
        $hashed = hash("sha512", $request->order_id . $request->status_code . $request->gross_amount . $serverKey);
        
        if ($hashed !== $request->signature_key) {
            return response()->json(['message' => 'Invalid signature'], 403);
        }

        // 2. Cari pendaftar berdasarkan no_pendaftaran
        // Ingat, kita menyimpan order_id sebagai 'no_pendaftaran-timestamp'
        $noPendaftaran = explode('-', $request->order_id)[0];
        $pendaftar = Pendaftar::where('no_pendaftaran', $noPendaftaran)->first();

        if (!$pendaftar) {
            return response()->json(['message' => 'Pendaftar not found'], 404);
        }

        // 3. Update status berdasarkan status transaksi Midtrans
        $transactionStatus = $request->transaction_status;

        if ($transactionStatus == 'settlement' || $transactionStatus == 'capture') {
            $pendaftar->update(['status_pembayaran' => 'success']);
        } else if ($transactionStatus == 'pending') {
            $pendaftar->update(['status_pembayaran' => 'pending']);
        } else if (in_array($transactionStatus, ['deny', 'expire', 'cancel'])) {
            $pendaftar->update(['status_pembayaran' => 'failed']);
        }

        return response()->json(['message' => 'Callback received and processed']);
    }
}
