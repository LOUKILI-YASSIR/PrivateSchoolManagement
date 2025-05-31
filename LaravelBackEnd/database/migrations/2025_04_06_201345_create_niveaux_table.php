<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('niveaux', function (Blueprint $table) {
            $table->string('MatriculeNV')->primary();
            $table->string('CodeNV');
            $table->string('NomNV');
            $table->string('DescriptionNV')->nullable();
            $table->string('MatriculeYR');
            $table->foreign('MatriculeYR')->references('MatriculeYR')->on('academic_years');
            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        Schema::dropIfExists('niveaux');
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    }
};
