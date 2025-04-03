<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('annees_academiques', function (Blueprint $table) {
            $table->string('matriculeAnnee')->primary();
            $table->string('matriculeInst');
            $table->date('dateDebut');
            $table->date('dateFin');
            $table->boolean('estActive')->default(true);
            $table->string('annee', 20);
            $table->timestamps();
            
            $table->foreign('matriculeInst')
                  ->references('matriculeInst')
                  ->on('institutions')
                  ->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('annees_academiques');
    }
}; 