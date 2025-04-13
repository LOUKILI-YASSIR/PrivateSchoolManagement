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
        Schema::create('holidays', function (Blueprint $table) {
            $table->string('matriculeHd')->primary();
            $table->date('startdateHd');
            $table->date('endDateHd');
            $table->string('nameHd');
            $table->string('descriptionHd')->nullable();
            $table->string('matriculeYR');
            $table->timestamps();

            $table->foreign('matriculeYR')->references('matriculeYR')->on('academic_years')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('holidays');
    }
};
