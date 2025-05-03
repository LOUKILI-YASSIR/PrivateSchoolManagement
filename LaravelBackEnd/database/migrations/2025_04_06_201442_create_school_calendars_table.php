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
            $table->string('MatriculeSC')->primary();
            $table->date('CalendarDateSC');
            $table->string('DayTypeSC');
            $table->string('MatriculeYR');
            $table->timestamps();

            $table->foreign('MatriculeYR')->references('MatriculeYR')->on('academic_years')->onDelete('cascade');
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
