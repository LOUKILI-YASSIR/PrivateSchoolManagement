<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('periodes', function (Blueprint $table) {
            $table->string('matriculePer')->primary();
            $table->string('nomPeriode');
            $table->dateTime('dateDebut');
            $table->dateTime('dateFin');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('periodes');
    }
}; 