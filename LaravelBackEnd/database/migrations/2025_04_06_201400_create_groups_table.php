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
        Schema::create('groups', function (Blueprint $table) {
            $table->string('MatriculeGP')->primary();
            $table->string('NameGP');
            $table->string('DescriptionGP')->nullable();
            $table->string('MatriculeYR');
            $table->string('MatriculeNV');
            $table->timestamps();

            $table->foreign('MatriculeNV')->references('MatriculeNV')->on('niveaux');
            $table->foreign('MatriculeYR')->references('MatriculeYR')->on('academic_years');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('groups');
    }
};
