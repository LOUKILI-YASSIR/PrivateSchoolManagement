<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('niveaux', function (Blueprint $table) {
            $table->string('matriculeNiv')->primary();
            $table->text('description');
            $table->string('libelle', 50);
            $table->integer('order');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('niveaux');
    }
}; 