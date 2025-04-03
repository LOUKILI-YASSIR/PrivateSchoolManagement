<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('emploi_du_temps', function (Blueprint $table) {
            $table->string('matriculeEmpt')->primary();
            $table->string('matriculeMat');
            $table->string('matriculeGrp');
            $table->string('matriculeSes');
            $table->string('matriculeAnnee');
            $table->string('matriculeSalle');
            $table->string('matriculeInst');
            $table->string('matriculePer');
            $table->string('matriculePr');
            $table->time('heureDebut');
            $table->time('heureFin');
            $table->enum('jourSemaine', ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']);
            $table->timestamps();
            
            $table->foreign('matriculeMat')
                  ->references('matriculeMat')
                  ->on('matieres')
                  ->onDelete('cascade');
                  
            $table->foreign('matriculeGrp')
                  ->references('matriculeGrp')
                  ->on('groupes')
                  ->onDelete('cascade');
                  
            $table->foreign('matriculeAnnee')
                  ->references('matriculeAnnee')
                  ->on('annees_academiques')
                  ->onDelete('cascade');
                  
            $table->foreign('matriculeSalle')
                  ->references('matriculeSalle')
                  ->on('salles')
                  ->onDelete('cascade');
                  
            $table->foreign('matriculeInst')
                  ->references('matriculeInst')
                  ->on('institutions')
                  ->onDelete('cascade');
                  
            $table->foreign('matriculePer')
                  ->references('matriculePer')
                  ->on('periodes')
                  ->onDelete('cascade');
                  
            $table->foreign('matriculePr')
                  ->references('matriculePR')
                  ->on('professeurs')
                  ->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('emploi_du_temps');
    }
}; 