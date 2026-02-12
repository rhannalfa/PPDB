<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Ekstrakurikuler extends Model
{
    // Nama kolom yang boleh diisi (Mass Assignment)
    protected $fillable = [
        'nama_ekskul'
    ];

    /**
     * Relasi: Satu Ekskul bisa dipilih oleh banyak Pendaftar
     */
    public function pendaftars(): HasMany
    {
        return $this->hasMany(Pendaftar::class);
    }
}