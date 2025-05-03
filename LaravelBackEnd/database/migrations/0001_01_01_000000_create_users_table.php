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
            $table->string('MatriculeUT')->primary();
            $table->string('UserNameUT')->unique();
            $table->boolean('must_change_password')->default(true);
            $table->timestamp('last_login_at')->nullable(); // Nullable for security
            $table->string('PasswordUT');
            $table->string('EmailUT')->unique();
            $table->string('PhoneUT')->nullable();
            $table->string('ThemePageUT')->default("dark");
            $table->string('LanguagePageUT')->default("fr");
            $table->string('CodeVerificationUT');
            $table->string('RoleUT');
            $table->string('StatutUT')->default('offline');
            $table->string('NomPL');
            $table->string('PrenomPL');
            $table->string('GenrePL')->nullable();
            $table->string('AdressPL')->nullable();
            $table->string('VillePL')->nullable();
            $table->string('CodePostalPL')->nullable();
            $table->string('PaysPL')->nullable();
            $table->string('NationalitePL')->nullable();
            $table->string('LieuNaissancePL')->nullable();
            $table->date('DateNaissancePL')->nullable();
            $table->text('ObservationPL')->nullable();
            $table->string('ProfileFileNamePL')->nullable();
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
