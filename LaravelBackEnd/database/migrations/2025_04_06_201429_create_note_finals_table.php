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
        Schema::create('note_finals', function (Blueprint $table) {
            $table->string('matriculeNf')->primary();
            $table->string('matriculeEt');
            $table->float('gradeNf');
            $table->string('commentaireNf')->nullable();
            $table->timestamps();

            $table->foreign('matriculeEt')->references('matriculeEt')->on('etudiants')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('note_finals');
    }
};
