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
            $table->string('MatriculeEV')->primary();
            $table->string('MatriculeMT');
            $table->string('MatriculeEP');
            $table->integer('NbrEV')->nullable();
            $table->timestamps();

            $table->foreign('MatriculeMT')->references('MatriculeMT')->on('matieres')->onDelete('cascade');
            $table->foreign('MatriculeEP')->references('MatriculeEP')->on('evaluation_types')->onDelete('cascade');
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
