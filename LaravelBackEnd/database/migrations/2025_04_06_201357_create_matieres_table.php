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
        Schema::create('matieres', function (Blueprint $table) {
            $table->string('matriculeMt')->primary();
            $table->string('nameMt');
            $table->string('codeMt');
            $table->string('descriptionMt')->nullable();
            $table->float('coefficientMt')->nullable();
            $table->string('matriculeNv');
            $table->string('matriculePr');
            $table->timestamps();

            $table->foreign('matriculeNv')->references('matriculeNv')->on('niveaux')->onDelete('cascade');
            $table->foreign('matriculePr')->references('matriculePr')->on('professeurs')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('matieres');
    }
};
