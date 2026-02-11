<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Jenjang;
use App\Models\Jurusan;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Pendaftar>
 */
class PendaftarFactory extends Factory
{
    public function definition(): array
    {
        $jenjang = Jenjang::inRandomOrder()->first() ?? Jenjang::factory()->create(['name' => 'SMP']);
        $jurusan = null;

        if (strtolower($jenjang->name) === 'smk') {
            $jurusan = Jurusan::where('jenjang_id', $jenjang->id)->inRandomOrder()->first() ?? Jurusan::factory()->create(['jenjang_id' => $jenjang->id, 'name' => 'Teknik Komputer dan Jaringan']);
        }

        return [
            'no_pendaftaran' => 'DUMMY-' . $this->faker->unique()->numerify('####'),
            'nama' => $this->faker->name(),
            'nik' => $this->faker->optional()->numerify('################'),
            'nisn' => $this->faker->optional()->numerify('##########'),
            'jenjang_id' => $jenjang->id,
            'jurusan_id' => $jurusan?->id,
            'alamat' => $this->faker->address(),
            'status_pendaftaran' => 'pending',
        ];
    }
}
