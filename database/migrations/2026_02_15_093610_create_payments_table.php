<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $row) {
            $row->id();
            $row->foreignId('registration_id')->constrained('pendaftars')->onDelete('cascade');
            $row->string('order_id')->unique(); // ID unik untuk Midtrans
            $row->decimal('amount', 10, 2)->default(500000);
            $row->string('status')->default('pending'); // pending, success, expired, failed
            $row->string('snap_token')->nullable(); // Simpan token agar tidak generate ulang terus
            $row->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
