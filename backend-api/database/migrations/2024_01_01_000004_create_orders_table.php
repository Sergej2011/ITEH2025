<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{  
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('buyer_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('seller_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('product_id')->constrained()->onDelete('cascade');
            $table->enum('status', ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'])->default('pending');
            $table->decimal('total_amount', 12, 2);
            $table->decimal('total_in_rsd', 12, 2)->nullable();
            $table->string('currency', 3)->default('RSD');
            $table->text('notes')->nullable();
            $table->timestamps();
            
            $table->index(['buyer_id', 'status']);
            $table->index(['seller_id', 'status']);
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
