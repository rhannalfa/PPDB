<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('pendaftars', function (Blueprint $table) {
            $table->id();
            // Field Utama (KODE ASLI DIERTAHANKAN)
            $table->string('no_pendaftaran')->unique();
            $table->string('nama');
            $table->string('nik', 16)->nullable()->index();
            $table->string('nisn', 10)->nullable()->index();
            
            // Field Detail (KODE ASLI DIERTAHANKAN + TAMBAHAN AGAMA)
            $table->string('jenis_kelamin')->nullable();
            $table->string('agama')->nullable(); // Penambahan Baru
            $table->string('tempat_lahir')->nullable();
            $table->date('tanggal_lahir')->nullable();
            $table->string('email')->nullable();
            $table->string('no_hp')->nullable();
            $table->string('asal_sekolah')->nullable();
            
            // Data Orang Tua & Kontak Tambahan
            $table->string('nama_ayah')->nullable();
            $table->string('nama_ibu')->nullable();
            $table->string('no_wa_ortu')->nullable(); // Penambahan Baru
            $table->string('email_ortu')->nullable(); // Penambahan Baru

            // Relasi (KODE ASLI DIERTAHANKAN + TAMBAHAN EKSKUL)
            $table->foreignId('jenjang_id')->constrained('jenjangs')->onDelete('cascade');
            $table->foreignId('jurusan_id')->nullable()->constrained('jurusans')->onDelete('cascade');
            $table->foreignId('ekstrakurikuler_id')->nullable()->constrained(); // Penambahan Baru
            
            // Alamat, Harapan & Status (KODE ASLI DIERTAHANKAN)
            $table->text('alamat')->nullable();
            $table->text('harapan')->nullable(); // Penambahan Baru
            $table->enum('status_pendaftaran', ['pending', 'verified', 'rejected'])->default('pending')->index();
            $table->timestamps();

            // Index Tambahan
            $table->index('no_pendaftaran');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pendaftars');
    }
};