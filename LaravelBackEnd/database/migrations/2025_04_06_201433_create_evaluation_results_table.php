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
        Schema::create('evaluation_results', function (Blueprint $table) {
            $table->string('matriculeER')->primary();
            $table->string('matriculeEt');
            $table->string('matriculeEv');
            $table->float('GradeER');
            $table->string('commentaireER')->nullable();
            $table->timestamps();

            $table->foreign('matriculeEt')->references('matriculeEt')->on('etudiants')->onDelete('cascade');
            $table->foreign('matriculeEv')->references('matriculeEv')->on('evaluations')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('evaluation_results');
    }
};
