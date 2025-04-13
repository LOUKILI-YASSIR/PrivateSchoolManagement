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
        Schema::create('school_calendars', function (Blueprint $table) {
            $table->string('matriculeSc')->primary();
            $table->date('calendarDateSc');
            $table->string('dayTypeSc');
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
        Schema::dropIfExists('school_calendars');
    }
};
