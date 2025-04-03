<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('inscription_etudiants', function (Blueprint $table) {
            $table->id();
            $table->string('matriculeEtudiant');
            $table->string('matriculeGroupe');
            $table->string('matriculeAnneeAcademique');
            $table->date('dateInscription');
            $table->string('statut')->default('active');
            $table->timestamps();

            $table->foreign('matriculeEtudiant')
                ->references('matriculeEt')
                ->on('etudiants')
                ->onDelete('cascade');

            $table->foreign('matriculeGroupe')
                ->references('matriculeGrp')
                ->on('groupes')
                ->onDelete('cascade');

            $table->foreign('matriculeAnneeAcademique')
                ->references('matriculeAnnee')
                ->on('annees_academiques')
                ->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('inscription_etudiants');
    }
}; 