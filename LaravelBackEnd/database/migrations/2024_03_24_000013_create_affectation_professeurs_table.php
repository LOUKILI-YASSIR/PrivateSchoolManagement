<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('affectation_professeurs', function (Blueprint $table) {
            $table->string('matriculeAff')->primary();
            $table->string('matriculePr');
            $table->string('matriculeGrp');
            $table->string('matriculeMat');
            $table->string('matriculeAnnee');
            $table->date('dateAffectation');
            $table->timestamps();
            
            $table->foreign('matriculePr')
                  ->references('matriculePR')
                  ->on('professeurs')
                  ->onDelete('cascade');
                  
            $table->foreign('matriculeGrp')
                  ->references('matriculeGrp')
                  ->on('groupes')
                  ->onDelete('cascade');
                  
            $table->foreign('matriculeMat')
                  ->references('matriculeMat')
                  ->on('matieres')
                  ->onDelete('cascade');
                  
            $table->foreign('matriculeAnnee')
                  ->references('matriculeAnnee')
                  ->on('annees_academiques')
                  ->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('affectation_professeurs');
    }
}; 