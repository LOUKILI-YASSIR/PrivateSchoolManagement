<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('salles', function (Blueprint $table) {
            $table->string('matriculeSl')->primary();
            $table->string('NameSl');
            $table->integer('CapacitySl');
            $table->string('LocationSl')->nullable();
            $table->string('ressourcesSl')->nullable();
            $table->string('typeSl')->nullable();
            $table->string('statusSl')->nullable();
            $table->string('floorSl')->nullable();
            $table->text('observationSl')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('salles');
    }
};
