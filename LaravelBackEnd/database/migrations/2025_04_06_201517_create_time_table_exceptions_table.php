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
        Schema::create('time_table_exceptions', function (Blueprint $table) {
            $table->string('matriculeTe')->primary();
            $table->string('exceptionTypeTe');
            $table->date('exceptionDateTe');
            $table->boolean('isFulldayTe')->default(false);
            $table->string('matriculeTs'); // FK to time_slots
            $table->string('reasonTe')->nullable();
            $table->string('newMatriculeTs')->nullable(); // Potentially FK to time_slots if replacement
            $table->timestamps();

            $table->foreign('matriculeTs')->references('matriculeTs')->on('time_slots')->onDelete('cascade');
            $table->foreign('newMatriculeTs')->references('matriculeTs')->on('time_slots')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('time_table_exceptions');
    }
};
