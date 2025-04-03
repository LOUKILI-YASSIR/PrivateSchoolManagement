<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('groupes', function (Blueprint $table) {
            $table->string('matriculeGrp')->primary();
            $table->string('matriculeNiv');
            $table->string('matriculeSect');
            $table->integer('capacite');
            $table->text('description');
            $table->string('nomGroupe');
            $table->timestamps();
            
            $table->foreign('matriculeNiv')
                  ->references('matriculeNiv')
                  ->on('niveaux')
                  ->onDelete('cascade');
                  
            $table->foreign('matriculeSect')
                  ->references('matriculeSect')
                  ->on('sections')
                  ->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('groupes');
    }
}; 