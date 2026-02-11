<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class PendaftarResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'no_pendaftaran' => $this->no_pendaftaran,
            'nama' => $this->nama,
            'jenjang' => $this->jenjang ? $this->jenjang->name : null,
            'jurusan' => $this->jurusan ? $this->jurusan->name : null,
            'status' => $this->status_pendaftaran,
            'created_at' => $this->created_at->toDateTimeString(),
        ];
    }
}
