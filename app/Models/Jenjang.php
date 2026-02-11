<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Jenjang extends Model
{
    protected $fillable = ['name'];

    public function jurusans(): HasMany
    {
        return $this->hasMany(Jurusan::class);
    }

    public function pendaftars(): HasMany
    {
        return $this->hasMany(Pendaftar::class);
    }
}
