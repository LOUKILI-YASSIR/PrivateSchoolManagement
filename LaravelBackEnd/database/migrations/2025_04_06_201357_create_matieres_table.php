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
        Schema::create('matieres', function (Blueprint $table) {
            $table->string('MatriculeMT')->primary();
            $table->string('NameMT');
            $table->string('CodeMT');
            $table->string('DescriptionMT')->nullable();
            $table->float('CoefficientMT')->nullable();
            $table->string('MatriculeNV');
            $table->string('MatriculeYR');
            $table->timestamps();
            $table->integer('max_sessions_per_week')->default(0);
            $table->foreign('MatriculeNV')->references('MatriculeNV')->on('niveaux')->onDelete('cascade');
            $table->foreign('MatriculeYR')->references('MatriculeYR')->on('academic_years');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('matieres');
    }
};
