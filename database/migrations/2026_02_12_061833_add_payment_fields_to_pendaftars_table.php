<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('pendaftars', function (Blueprint $table) {
            $table->string('snap_token')->nullable(); // Token untuk memunculkan popup Midtrans
            $table->enum('status_pembayaran', ['pending', 'success', 'failed', 'expired'])->default('pending');
            $table->decimal('total_bayar', 10, 2)->default(150000); // Contoh biaya pendaftaran
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pendaftars', function (Blueprint $table) {
            //
        });
    }
};
