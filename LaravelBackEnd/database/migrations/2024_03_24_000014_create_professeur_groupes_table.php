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
        Schema::create('professeur_groupes', function (Blueprint $table) {
            $table->string('matriculeProfGrp', 22)->primary();
            $table->string('matriculePr', 20);
            $table->string('matriculeGrp', 22);
            $table->string('matriculeAnnee', 22);
            $table->timestamps();

            $table->foreign('matriculePr')->references('matriculePr')->on('professeurs')->onDelete('cascade');
            $table->foreign('matriculeGrp')->references('matriculeGrp')->on('groupes')->onDelete('cascade');
            $table->foreign('matriculeAnnee')->references('matriculeAnnee')->on('annees_academiques')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('professeur_groupes');
    }
}; 