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
        Schema::create('sections', function (Blueprint $table) {
            $table->string('matriculeSect')->primary();
            $table->string('nomSect');
            $table->string('matriculeAnnee');
            $table->timestamps();

            $table->foreign('matriculeAnnee')
                  ->references('matriculeAnnee')
                  ->on('annees_academiques')
                  ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sections');
    }
}; 