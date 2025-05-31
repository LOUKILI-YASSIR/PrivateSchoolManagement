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
        Schema::create('regular_time_tables', function (Blueprint $table) {
            $table->string('MatriculeRT')->primary();
            $table->string('MatriculeYR');
            $table->string('MatriculeDW');
            $table->string('MatriculeTS');
            $table->string('MatriculeGP');
            $table->string('MatriculeMT');
            $table->string('MatriculePR');
            $table->string('MatriculeSL');
            $table->timestamps();

            $table->foreign('MatriculeYR')->references('MatriculeYR')->on('academic_years');
            $table->foreign('MatriculeDW')->references('MatriculeDW')->on('day_weeks')->onDelete('cascade');
            $table->foreign('MatriculeTS')->references('MatriculeTS')->on('time_slots')->onDelete('cascade');
            $table->foreign('MatriculeGP')->references('MatriculeGP')->on('groups')->onDelete('cascade');
            $table->foreign('MatriculeMT')->references('MatriculeMT')->on('matieres')->onDelete('cascade');
            $table->foreign('MatriculePR')->references('MatriculePR')->on('professeurs')->onDelete('cascade');
            $table->foreign('MatriculeSL')->references('MatriculeSL')->on('salles')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('regular_time_tables');
    }
};
