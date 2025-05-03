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
        Schema::create('note_finals', function (Blueprint $table) {
            $table->string('MatriculeNF')->primary();
            $table->string('MatriculeET');
            $table->float('GradeNF');
            $table->string('CommentaireNF')->nullable();
            $table->timestamps();

            $table->foreign('MatriculeET')->references('MatriculeET')->on('etudiants')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('note_finals');
    }
};
