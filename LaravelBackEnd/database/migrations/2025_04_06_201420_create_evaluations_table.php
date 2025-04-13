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
        Schema::create('evaluations', function (Blueprint $table) {
            $table->string('matriculeEv')->primary();
            $table->string('matriculeMt');
            $table->string('matriculeEp');
            $table->integer('nbrEv')->nullable();
            $table->timestamps();

            $table->foreign('matriculeMt')->references('matriculeMt')->on('matieres')->onDelete('cascade');
            $table->foreign('matriculeEp')->references('matriculeEp')->on('evaluation_types')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('evaluations');
    }
};
