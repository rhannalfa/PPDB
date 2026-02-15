<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Pendaftar extends Model
{
    protected $fillable = [
        // Data Utama & Akses
        'no_pendaftaran',
        'nama',
        'nik',
        'nisn',
        'agama',

        // Data Profil Tambahan
        'jenis_kelamin',
        'tempat_lahir',
        'tanggal_lahir',
        'email',
        'no_hp',

        // Data Sekolah & Pilihan
        'jenjang_id',
        'jurusan_id',
        'ekstrakurikuler_id',
        'asal_sekolah',

        // Data Orang Tua & Kontak
        'nama_ayah',
        'nama_ibu',
        'no_wa_ortu',
        'email_ortu',

        // Alamat & Status Sistem
        'alamat',
        'harapan',
        'status_pendaftaran',

        // --- TAMBAHKAN DUA BARIS INI ---
        'snap_token',        // Untuk menyimpan token dari Midtrans
        'status_pembayaran', // Untuk melacak status (pending, success, failed)
    ];

    /**
     * Relasi ke model Jenjang
     */
    public function jenjang(): BelongsTo
    {
        return $this->belongsTo(Jenjang::class);
    }

    /**
     * Relasi ke model Jurusan
     */
    public function jurusan(): BelongsTo
    {
        return $this->belongsTo(Jurusan::class);
    }

    /**
     * Relasi ke model Ekstrakurikuler
     */
    public function ekstrakurikuler(): BelongsTo
    {
        return $this->belongsTo(Ekstrakurikuler::class);
    }
}
