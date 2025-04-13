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
        Schema::create('teacher_vocations', function (Blueprint $table) {
            $table->string('matriculeTv')->primary();
            $table->string('matriculePr');
            $table->date('startDatetv');
            $table->boolean('approvedTv')->default(false);
            $table->date('endDatetv')->nullable();
            $table->timestamps();

            $table->foreign('matriculePr')->references('matriculePr')->on('professeurs')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('teacher_vocations');
    }
};
