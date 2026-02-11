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
        $jenjangId = $this->input('jenjang_id');
        $jenjang = $jenjangId ? Jenjang::find($jenjangId) : null;
        $isSmk = $jenjang && strtolower($jenjang->name) === 'smk';

        return [
            'nama' => ['required', 'string', 'max:255'],
            'nik' => ['nullable', 'string', 'max:32'],
            'nisn' => ['nullable', 'string', 'max:32'],
            'jenjang_id' => ['required', 'exists:jenjangs,id'],
            'jurusan_id' => [
                'nullable',
                'exists:jurusans,id',
                Rule::requiredIf(fn () => $isSmk),
            ],
            'alamat' => ['nullable', 'string'],
        ];
    }

    public function withValidator($validator)
    {
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
