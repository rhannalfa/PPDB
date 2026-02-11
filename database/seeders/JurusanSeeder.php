<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Jenjang;
use App\Models\Jurusan;

class JurusanSeeder extends Seeder
{
    public function run(): void
    {
        $smk = Jenjang::where('name', 'SMK')->first();
        if ($smk) {
            Jurusan::firstOrCreate(['jenjang_id' => $smk->id, 'name' => 'Pengembangan Perangkat Lunak dan Game']);
            Jurusan::firstOrCreate(['jenjang_id' => $smk->id, 'name' => 'Bisnis Retail']);
        }
    }
}
