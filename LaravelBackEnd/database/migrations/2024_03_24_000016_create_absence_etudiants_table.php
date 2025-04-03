<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('absence_etudiants', function (Blueprint $table) {
            $table->string('matriculeAbsEt')->primary();
            $table->string('matriculeEt');
            $table->string('matriculeAnnee');
            $table->date('dateAbsence');
            $table->string('motif');
            $table->boolean('estJustifie')->default(false);
            $table->timestamps();
            
            $table->foreign('matriculeAnnee')
                  ->references('matriculeAnnee')
                  ->on('annees_academiques')
                  ->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('absence_etudiants');
    }
}; 