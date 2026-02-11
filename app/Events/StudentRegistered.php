<?php

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Queue\SerializesModels;
use App\Models\Pendaftar;

class StudentRegistered implements ShouldBroadcast
{
    use InteractsWithSockets, SerializesModels;

    public Pendaftar $pendaftar;

    public function __construct(Pendaftar $pendaftar)
    {
        $this->pendaftar = $pendaftar;
    }

    public function broadcastOn()
    {
        return ['status-pendaftaran'];
    }

    public function broadcastAs(): string
    {
        return 'StudentRegistered';
    }

    public function broadcastWith(): array
    {
        return [
            'id' => $this->pendaftar->id,
            'no_pendaftaran' => $this->pendaftar->no_pendaftaran,
            'nama' => $this->pendaftar->nama,
            'jenjang' => $this->pendaftar->jenjang?->name,
            'status' => $this->pendaftar->status_pendaftaran,
            'created_at' => $this->pendaftar->created_at->toDateTimeString(),
        ];
    }
}
