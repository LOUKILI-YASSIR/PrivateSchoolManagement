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
        Schema::create('time_table_exceptions', function (Blueprint $table) {
            $table->string('MatriculeTE')->primary();
            $table->string('MatriculeYR');
            $table->string('ExceptionTypeTE');
            $table->date('ExceptionDateTE');
            $table->boolean('IsFullDayTE')->default(false);
            $table->string('MatriculeTS'); // FK to time_slots
            $table->string('ReasonTE')->nullable();
            $table->string('NewMatriculeTS')->nullable(); // Potentially FK to time_slots if replacement
            $table->timestamps();

            $table->foreign('MatriculeTS')->references('MatriculeTS')->on('time_slots')->onDelete('cascade');
            $table->foreign('NewMatriculeTS')->references('MatriculeTS')->on('time_slots')->onDelete('set null');
            $table->foreign('MatriculeYR')->references('MatriculeYR')->on('academic_years');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('time_table_exceptions');
    }
};
