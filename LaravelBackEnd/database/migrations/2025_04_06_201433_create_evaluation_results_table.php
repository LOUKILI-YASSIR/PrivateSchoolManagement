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
        Schema::create('evaluation_results', function (Blueprint $table) {
            $table->string('MatriculeER')->primary();
            $table->string('MatriculeET');
            $table->string('MatriculeEV');
            $table->string('MatriculeYR');
            $table->float('GradeER');
            $table->string('CommentaireER')->nullable();
            $table->timestamps();

            $table->foreign('MatriculeET')->references('MatriculeET')->on('etudiants')->onDelete('cascade');
            $table->foreign('MatriculeEV')->references('MatriculeEV')->on('evaluations')->onDelete('cascade');
            $table->foreign('MatriculeYR')->references('MatriculeYR')->on('academic_years');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('evaluation_results');
    }
};
