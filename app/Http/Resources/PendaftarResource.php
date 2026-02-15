<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class PendaftarResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'no_pendaftaran' => $this->no_pendaftaran, // Kunci utama untuk redirect
            'nama' => $this->nama,
            'email' => $this->email, // Dibutuhkan untuk konfirmasi di payment page
            'no_hp' => $this->no_hp,
            'jenjang' => $this->jenjang ? ($this->jenjang->name ?? $this->jenjang->nama) : null,
            'jurusan' => $this->jurusan ? ($this->jurusan->name ?? $this->jurusan->nama) : null,
            
            // Status Sistem
            'status_pendaftaran' => $this->status_pendaftaran,
            'status_pembayaran' => $this->status_pembayaran, // lunas/pending
            
            // Token Pembayaran
            'snap_token' => $this->snap_token, // Agar user bisa bayar tanpa isi data lagi
            
            'created_at' => $this->created_at ? $this->created_at->toDateTimeString() : null,
        ];
    }
}