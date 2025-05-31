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
            $table->string('MatriculeNT')->primary();
            $table->string('MatriculeET');
            $table->string('MatriculeMT');
            $table->string('MatriculeYR');
            $table->float('GradeNT');
            $table->string('CommentaireNT')->nullable();
            $table->timestamps();

            $table->foreign('MatriculeET')->references('MatriculeET')->on('etudiants')->onDelete('cascade');
            $table->foreign('MatriculeMT')->references('MatriculeMT')->on('matieres')->onDelete('cascade');
            $table->foreign('MatriculeYR')->references('MatriculeYR')->on('academic_years');
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
