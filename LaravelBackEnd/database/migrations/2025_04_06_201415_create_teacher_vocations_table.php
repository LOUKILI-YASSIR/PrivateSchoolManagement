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
        Schema::create('teacher_vocations', function (Blueprint $table) {
            $table->string('MatriculeTV')->primary();
            $table->string('MatriculePR');
            $table->string('MatriculeYR');
            $table->date('StartDatetV');
            $table->boolean('ApprovedTV')->default(false);
            $table->date('EndDateTV')->nullable();
            $table->timestamps();

            $table->foreign('MatriculePR')->references('MatriculePR')->on('professeurs')->onDelete('cascade');
            $table->foreign('MatriculeYR')->references('MatriculeYR')->on('academic_years');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('teacher_vocations');
    }
};
