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
            $table->string('MatriculeHd')->primary();
            $table->date('StartdateHd');
            $table->date('EndDateHd');
            $table->string('NameHd');
            $table->string('DescriptionHd')->nullable();
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
        Schema::dropIfExists('holidays');
    }
};
