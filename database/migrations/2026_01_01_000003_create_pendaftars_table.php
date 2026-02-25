<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('pendaftars', function (Blueprint $table) {
            $table->id();
            $table->string('no_pendaftaran')->unique();
            $table->string('nama');
            $table->string('nik')->nullable()->index();
            $table->string('nisn')->nullable()->index();
            $table->foreignId('jenjang_id')->constrained('jenjangs')->onDelete('cascade');
            $table->foreignId('jurusan_id')->nullable()->constrained('jurusans')->onDelete('cascade');
            $table->text('alamat')->nullable();
            $table->enum('status_pendaftaran', ['pending', 'verified', 'rejected'])->default('pending')->index();
            $table->timestamps();

            $table->index('no_pendaftaran');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pendaftars');
    }
};
