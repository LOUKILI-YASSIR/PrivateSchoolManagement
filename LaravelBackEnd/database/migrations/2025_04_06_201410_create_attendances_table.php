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
        Schema::create('attendances', function (Blueprint $table) {
            $table->string('MatriculeAT')->primary();
            $table->string('StatusAT');
            $table->boolean('IsJustifAT')->default(false);
            $table->string('JustifAT')->nullable();
            $table->date('DateAT');
            $table->string('MatriculeUT');
            $table->string('MatriculeET')->nullable(); // Nullable based on diagram (0..1 relation)
            $table->string('MatriculePR')->nullable(); // Nullable based on diagram (0..1 relation)
            $table->timestamps();

            $table->foreign('MatriculeUT')->references('MatriculeUT')->on('users')->onDelete('cascade');
            $table->foreign('MatriculeET')->references('MatriculeET')->on('etudiants')->onDelete('cascade');
            $table->foreign('MatriculePR')->references('MatriculePR')->on('professeurs')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attendances');
    }
};
