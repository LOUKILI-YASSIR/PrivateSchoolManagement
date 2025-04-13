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
        Schema::create('users', function (Blueprint $table) {
            // $table->id(); // Remove default ID
            $table->string('matriculeUt')->primary();
            $table->string('usernameUt')->unique();
            $table->string('passwordUt');
            $table->string('emailUt')->unique();
            $table->string('phoneUt')->nullable();
            $table->string('roleUt');
            $table->string('statutUt')->default('offline');
            $table->string('NomPl');
            $table->string('prenomPl');
            $table->string('GenrePl')->nullable();
            $table->string('AdressPl')->nullable();
            $table->string('VillePl')->nullable();
            $table->string('CodePostalPl')->nullable();
            $table->string('PaysPl')->nullable();
            $table->string('NationalitePl')->nullable();
            $table->string('LieuNaissancePl')->nullable();
            $table->date('DateNaissancePl')->nullable();
            $table->text('ObservationPl')->nullable();
            $table->string('ProfileFileNamePl')->nullable();
            $table->timestamp('email_verified_at')->nullable();
            $table->rememberToken(); // Standard Laravel column
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
