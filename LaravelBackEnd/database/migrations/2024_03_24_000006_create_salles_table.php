<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('salles', function (Blueprint $table) {
            $table->string('matriculeSalle')->primary();
            $table->integer('capacite');
            $table->text('description');
            $table->string('nomSalle');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('salles');
    }
}; 