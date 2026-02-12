<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Ekstrakurikuler; // Pastikan Model ini sudah ada
use Illuminate\Support\Facades\DB;

class EkstrakurikulerSeeder extends Seeder
{
    public function run(): void
    {
        // Menghapus data lama agar tidak duplikat saat seeder dijalankan ulang
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('ekstrakurikulers')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $data = [
            ['nama_ekskul' => 'Pramuka'],
            ['nama_ekskul' => 'Paskibra'],
            ['nama_ekskul' => 'PMR (Palang Merah Remaja)'],
            ['nama_ekskul' => 'Futsal'],
            ['nama_ekskul' => 'Basket'],
            ['nama_ekskul' => 'Seni Musik'],
            ['nama_ekskul' => 'Seni Tari'],
            ['nama_ekskul' => 'IT Club (Coding & Robotik)'],
            ['nama_ekskul' => 'English Club'],
            ['nama_ekskul' => 'Rohis'],
        ];

        foreach ($data as $item) {
            DB::table('ekstrakurikulers')->insert([
                'nama_ekskul' => $item['nama_ekskul'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}