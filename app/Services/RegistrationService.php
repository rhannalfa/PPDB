<?php

namespace App\Services;

use App\Models\Pendaftar;
use App\Models\Jenjang;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

class RegistrationService
{
    /**
     * Menghasilkan nomor pendaftaran unik berbasis jenjang dan tahun.
     * Contoh: SKYE-SMK-2026-0001
     */
    public function generateNoPendaftaran(Jenjang $jenjang): string
    {
        $year = Carbon::now()->year;
        $prefix = sprintf('SKYE-%s-%s', strtoupper($jenjang->name), $year);

        // Mengunci baris untuk mencegah duplikasi nomor di waktu yang bersamaan
        $count = Pendaftar::where('jenjang_id', $jenjang->id)
            ->whereYear('created_at', $year)
            ->lockForUpdate()
            ->count();

        $serial = str_pad($count + 1, 4, '0', STR_PAD_LEFT);

        return "{$prefix}-{$serial}";
    }

    /**
     * Mendaftarkan siswa baru ke database.
     */
    public function register(array $data): Pendaftar
    {
        return DB::transaction(function () use ($data) {
            // 1. Ambil data jenjang untuk keperluan prefix nomor
            $jenjang = Jenjang::findOrFail($data['jenjang_id']);
            
            // 2. Generate nomor pendaftaran otomatis
            $no = $this->generateNoPendaftaran($jenjang);

            // 3. Gabungkan data input dengan sistem (nomor & status default)
            // Menggunakan array_merge agar SEMUA field baru (email, orang tua, dll) ikut tersimpan
            $payload = array_merge($data, [
                'no_pendaftaran' => $no,
                'status_pendaftaran' => 'pending',
            ]);

            // 4. Simpan ke database
            $pendaftar = Pendaftar::create($payload);

            // 5. Trigger event (jika kamu memiliki file Event-nya)
            if (class_exists(\App\Events\StudentRegistered::class)) {
                event(new \App\Events\StudentRegistered($pendaftar));
            }

            return $pendaftar;
        });
    }
}