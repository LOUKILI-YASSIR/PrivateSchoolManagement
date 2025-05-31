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
        Schema::create('grade_adjustments', function (Blueprint $table) {
            $table->string('MatriculeGA')->primary();
            $table->string('TypeGA');
            $table->float('ValueGA');
            $table->string('ReasonGA')->nullable();
            $table->date('DateGA');
            $table->string('MatriculeER'); // FK to evaluation_results
            $table->string('MatriculeYR');
            $table->timestamps();

            $table->foreign('MatriculeER')->references('MatriculeER')->on('evaluation_results')->onDelete('cascade');
            $table->foreign('MatriculeYR')->references('MatriculeYR')->on('academic_years');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('grade_adjustments');
    }
};
