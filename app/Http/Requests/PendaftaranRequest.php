<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use App\Models\Jenjang;

class PendaftaranRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        // LOGIKA ASLI (DIPERTAHANKAN)
        $jenjangId = $this->input('jenjang_id');
        $jenjang = $jenjangId ? Jenjang::find($jenjangId) : null;
        $isSmk = $jenjang && strtolower($jenjang->name) === 'smk';

        return [
            // PENGGABUNGAN ATURAN BARU & LAMA
            'nama'            => ['required', 'string', 'max:255'],
            'nik'             => ['required', 'string', 'size:16'], // Diperketat jadi size 16
            'nisn'            => ['required', 'string', 'size:10'], // Diperketat jadi size 10
            'jenis_kelamin'   => ['required', 'string'],
            'tempat_lahir'    => ['required', 'string'],
            'tanggal_lahir'   => ['required', 'date'],
            'email'           => ['required', 'email'],
            'no_hp'           => ['required', 'string'],
            'jenjang_id'      => ['required', 'exists:jenjangs,id'],
            'jurusan_id'      => [
                'nullable',
                'exists:jurusans,id',
                Rule::requiredIf(fn () => $isSmk), // Logika SMK tetap jalan
            ],
            'asal_sekolah'    => ['required', 'string'],
            'nama_ayah'       => ['required', 'string'],
            'nama_ibu'        => ['required', 'string'],
            'alamat'          => ['required', 'string'],
            'agama' => 'required|string',
            'no_wa_ortu' => 'required|string',
            'email_ortu' => 'required|email',
            'harapan' => 'required|string',
            'ekstrakurikuler_id' => 'required|exists:ekstrakurikulers,id',
        ];
    }

    public function withValidator($validator)
    {
        // LOGIKA ASLI UNTUK SMP (DIPERTAHANKAN)
        $validator->after(function ($validator) {
            $jenjangId = $this->input('jenjang_id');
            if ($jenjangId) {
                $jenjang = Jenjang::find($jenjangId);
                if ($jenjang && strtolower($jenjang->name) === 'smp' && $this->filled('jurusan_id')) {
                    $validator->errors()->add('jurusan_id', 'Jurusan harus kosong untuk jenjang SMP.');
                }
            }
        });
    }
}