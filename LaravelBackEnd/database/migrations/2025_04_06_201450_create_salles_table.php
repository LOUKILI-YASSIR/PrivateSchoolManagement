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
            $table->string('MatriculeSL')->primary();
            $table->string('NameSL');
            $table->integer('CapacitySL');
            $table->string('LocationSL')->nullable();
            $table->string('RessourcesSL')->nullable();
            $table->string('TypeSL')->nullable();
            $table->string('StatusSL')->nullable();
            $table->string('FloorSL')->nullable();
            $table->text('ObservationSL')->nullable();
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
