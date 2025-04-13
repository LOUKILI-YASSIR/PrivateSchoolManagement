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
        Schema::create('regular_time_tables', function (Blueprint $table) {
            $table->string('matriculeRt')->primary();
            $table->string('matriculeDW');
            $table->string('matriculeTs');
            $table->string('matriculeGp');
            $table->string('matriculeMt');
            $table->string('matriculePr');
            $table->string('matriculeSl');
            $table->timestamps();

            $table->foreign('matriculeDW')->references('matriculeDW')->on('day_weeks')->onDelete('cascade');
            $table->foreign('matriculeTs')->references('matriculeTs')->on('time_slots')->onDelete('cascade');
            $table->foreign('matriculeGp')->references('matriculeGp')->on('groups')->onDelete('cascade');
            $table->foreign('matriculeMt')->references('matriculeMt')->on('matieres')->onDelete('cascade');
            $table->foreign('matriculePr')->references('matriculePr')->on('professeurs')->onDelete('cascade');
            $table->foreign('matriculeSl')->references('matriculeSl')->on('salles')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('regular_time_tables');
    }
};
