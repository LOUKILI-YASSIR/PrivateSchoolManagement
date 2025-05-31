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
        Schema::create('etudiants', function (Blueprint $table) {
            $table->string('MatriculeET')->primary();
            $table->string('EmailET')->unique()->nullable();
            $table->string('PhoneET')->unique()->nullable();
            $table->string('LienParenteTR')->nullable();
            $table->string('ProfessionTR')->nullable();
            $table->string('NomTR')->nullable();
            $table->string('PrenomTR')->nullable();
            $table->string('Phone1TR')->nullable();
            $table->string('Phone2TR')->nullable();
            $table->string('EmailTR')->nullable();
            $table->text('ObservationTR')->nullable();
            $table->string('MatriculeUT');
            $table->string('MatriculeGP')->nullable();
            $table->string('MatriculeNV');
            $table->string('MatriculeYR');
            $table->timestamps();

            $table->foreign('MatriculeUT')->references('MatriculeUT')->on('users')->onDelete('cascade');
            $table->foreign('MatriculeGP')->references('MatriculeGP')->on('groups')->onDelete('set null');
            $table->foreign('MatriculeNV')->references('MatriculeNV')->on('niveaux')->onDelete('restrict');
            $table->foreign('MatriculeYR')->references('MatriculeYR')->on('academic_years');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('etudiants');
    }
};
