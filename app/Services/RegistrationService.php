<?php

namespace App\Services;

use App\Models\Pendaftar;
use App\Models\Jenjang;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;

class RegistrationService
{
    public function generateNoPendaftaran(Jenjang $jenjang): string
    {
        $year = Carbon::now()->year;
        $prefix = sprintf('SKYE-%s-%s', strtoupper($jenjang->name), $year);

        $count = Pendaftar::where('jenjang_id', $jenjang->id)
            ->whereYear('created_at', $year)
            ->lockForUpdate()
            ->count();

        $serial = str_pad($count + 1, 4, '0', STR_PAD_LEFT);

        return "{$prefix}-{$serial}";
    }

    public function register(array $data): Pendaftar
    {
        return DB::transaction(function () use ($data) {
            $jenjang = Jenjang::findOrFail($data['jenjang_id']);
            $no = $this->generateNoPendaftaran($jenjang);

            $pendaftar = Pendaftar::create([
                'no_pendaftaran' => $no,
                'nama' => $data['nama'],
                'nik' => $data['nik'] ?? null,
                'nisn' => $data['nisn'] ?? null,
                'jenjang_id' => $data['jenjang_id'],
                'jurusan_id' => $data['jurusan_id'] ?? null,
                'alamat' => $data['alamat'] ?? null,
                'status_pendaftaran' => 'pending',
            ]);

            event(new \App\Events\StudentRegistered($pendaftar));

            return $pendaftar;
        });
    }
}
