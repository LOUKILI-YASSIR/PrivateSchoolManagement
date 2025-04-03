<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('matriculeUt')->unique();
            $table->string('nomUsers');
            $table->string('email')->unique()->nullable();
            $table->string('phone_number')->unique()->nullable();
            $table->string('matricule')->unique();
            $table->string('role');
            $table->string('password');
            $table->string('api_token', 80)->unique()->nullable();
            
            // Personal Information
            $table->string('prenom')->nullable();
            $table->date('date_naissance')->nullable();
            $table->enum('sexe', ['M', 'F'])->nullable();
            $table->string('nationalite')->nullable();
            $table->string('lieu_naissance')->nullable();
            
            // Contact Information
            $table->string('adresse')->nullable();
            $table->string('code_postal')->nullable();
            $table->string('ville')->nullable();
            $table->string('pays')->nullable();
            $table->string('telephone_fixe')->nullable();
            $table->string('telephone_mobile')->nullable();
            
            // Emergency Contact
            $table->string('contact_urgence_nom')->nullable();
            $table->string('contact_urgence_telephone')->nullable();
            $table->string('contact_urgence_relation')->nullable();
            
            // Additional Information
            $table->string('photo')->nullable();
            $table->text('notes')->nullable();
            $table->boolean('actif')->default(true);
            
            $table->rememberToken();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down()
    {
        Schema::dropIfExists('users');
    }
}; 