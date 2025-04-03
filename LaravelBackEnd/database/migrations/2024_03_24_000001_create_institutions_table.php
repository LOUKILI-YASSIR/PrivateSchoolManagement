<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('institutions', function (Blueprint $table) {
            $table->string('matriculeInst')->primary();
            $table->string('nomInst', 50);
            $table->dateTime('dateDebut');
            $table->dateTime('dateFin');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('institutions');
    }
}; 