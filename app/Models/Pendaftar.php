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
        'agama', // Penambahan Baru
        
        // Data Profil Tambahan
        'jenis_kelamin',
        'tempat_lahir',
        'tanggal_lahir',
        'email',
        'no_hp',
        
        // Data Sekolah & Pilihan
        'jenjang_id',
        'jurusan_id',
        'ekstrakurikuler_id', // Penambahan Baru
        'asal_sekolah',
        
        // Data Orang Tua & Kontak
        'nama_ayah',
        'nama_ibu',
        'no_wa_ortu', // Penambahan Baru
        'email_ortu', // Penambahan Baru
        
        // Alamat & Status Sistem
        'alamat',
        'harapan', // Penambahan Baru
        'status_pendaftaran',
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
     * Menambahkan relasi baru agar admin bisa melihat ekskul pilihan siswa
     */
    public function ekstrakurikuler(): BelongsTo
    {
        return $this->belongsTo(Ekstrakurikuler::class);
    }
}