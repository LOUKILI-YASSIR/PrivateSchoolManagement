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
            $table->string('matriculeUt')->primary();
            $table->string('nomUt')->unique();
            $table->string('passwordUt');
            $table->string('roleUt')->check("roleUt IN ('etudiant', 'professeur', 'admin')");
            $table->rememberToken(); // For authentication
            $table->timestamps(); // Created_at and updated_at
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
