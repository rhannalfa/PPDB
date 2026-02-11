<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Pendaftar extends Model
{
    protected $fillable = [
        'no_pendaftaran',
        'nama',
        'nik',
        'nisn',
        'jenjang_id',
        'jurusan_id',
        'alamat',
        'status_pendaftaran',
    ];

    public function jenjang(): BelongsTo
    {
        return $this->belongsTo(Jenjang::class);
    }

    public function jurusan(): BelongsTo
    {
        return $this->belongsTo(Jurusan::class);
    }
}
