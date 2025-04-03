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
        Schema::create('evaluations', function (Blueprint $table) {
            $table->string('matriculeEvl')->primary();
            $table->string('matriculeEt');
            $table->string('matriculeMat');
            $table->string('matriculeAnnee');
            $table->enum('typeEvaluation', ['contrôle', 'exam_final', 'transition', "monitoring_behavior", 'other']);
            $table->decimal('max_grade',5,2);
            $table->float('percentage');
            $table->enum('extraPar', ['admin', 'professeur']);
            $table->timestamps();

            $table->foreign('matriculeEt')
                  ->references('matriculeEt')
                  ->on('etudiants')
                  ->onDelete('cascade');

            $table->foreign('matriculeMat')
                  ->references('matriculeMat')
                  ->on('matieres')
                  ->onDelete('cascade');

            $table->foreign('matriculeAnnee')
                  ->references('matriculeAnnee')
                  ->on('annees_academiques')
                  ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('evaluations');
    }
};
