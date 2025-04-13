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
            $table->string('matriculeEt')->primary();
            $table->string('emailEt')->unique();
            $table->string('phoneEt')->nullable();
            $table->string('lienParenteTr')->nullable();
            $table->string('professionTr')->nullable();
            $table->string('NomTr')->nullable();
            $table->string('PrenomTr')->nullable();
            $table->string('Phone1Tr')->nullable();
            $table->string('Phone2Tr')->nullable();
            $table->string('EmailTr')->nullable();
            $table->text('ObservationTr')->nullable();
            $table->string('matriculeUt');
            $table->string('matriculeGp');
            $table->timestamps();

            $table->foreign('matriculeUt')->references('matriculeUt')->on('users')->onDelete('cascade');
            $table->foreign('matriculeGp')->references('matriculeGp')->on('groups')->onDelete('cascade');
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
