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
            $table->string('matriculeYR')->primary();
            $table->string('statusYR');
            $table->string('NameYR');
            $table->string('descriptionYR')->nullable();
            $table->date('startDateYR');
            $table->date('endDateYR');
            $table->date('ArchivedDateYR')->nullable();
            $table->boolean('isCurrentYR')->default(false);
            $table->string('matriculeUt'); // FK to users
            $table->timestamps();

            $table->foreign('matriculeUt')->references('matriculeUt')->on('users')->onDelete('cascade');
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
