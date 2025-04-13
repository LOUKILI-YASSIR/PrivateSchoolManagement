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
        Schema::create('attendances', function (Blueprint $table) {
            $table->string('matriculeAt')->primary();
            $table->string('statusAt');
            $table->boolean('isJustifAt')->default(false);
            $table->string('justifAt')->nullable();
            $table->date('DateAt');
            $table->string('matriculeUt');
            $table->string('matriculeEt')->nullable(); // Nullable based on diagram (0..1 relation)
            $table->string('matriculePr')->nullable(); // Nullable based on diagram (0..1 relation)
            $table->timestamps();

            $table->foreign('matriculeUt')->references('matriculeUt')->on('users')->onDelete('cascade');
            $table->foreign('matriculeEt')->references('matriculeEt')->on('etudiants')->onDelete('cascade');
            $table->foreign('matriculePr')->references('matriculePr')->on('professeurs')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attendances');
    }
};
