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
        Schema::create('academic_years', function (Blueprint $table) {
            $table->string('MatriculeYR')->primary();
            $table->string('StatusYR');
            $table->string('NameYR');
            $table->string('DescriptionYR')->nullable();
            $table->date('StartDateYR');
            $table->date('EndDateYR');
            $table->date('ArchivedDateYR')->nullable();
            $table->boolean('IsCurrentYR')->default(false);
            $table->string('MatriculeUT'); // FK to users
            $table->timestamps();

            $table->foreign('MatriculeUT')->references('MatriculeUT')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('academic_years');
    }
};
