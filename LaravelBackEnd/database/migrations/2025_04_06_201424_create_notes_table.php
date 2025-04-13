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
        Schema::create('notes', function (Blueprint $table) {
            $table->string('matriculeNt')->primary();
            $table->string('matriculeEt');
            $table->string('matriculeMt');
            $table->float('gradeNt');
            $table->string('commentaireNt')->nullable();
            $table->timestamps();

            $table->foreign('matriculeEt')->references('matriculeEt')->on('etudiants')->onDelete('cascade');
            $table->foreign('matriculeMt')->references('matriculeMt')->on('matieres')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notes');
    }
};
