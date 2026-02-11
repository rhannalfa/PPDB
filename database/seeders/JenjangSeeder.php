<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Jenjang;

class JenjangSeeder extends Seeder
{
    public function run(): void
    {
        Jenjang::firstOrCreate(['name' => 'SMP']);
        Jenjang::firstOrCreate(['name' => 'SMK']);
    }
}
