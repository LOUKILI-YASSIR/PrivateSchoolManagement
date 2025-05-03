<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('niveaux', function (Blueprint $table) {
            $table->string('MatriculeNV')->primary();
            $table->string('CodeNV');
            $table->string('NomNV');
            $table->string('SubMatriculeNV')->nullable();
            $table->string('TypeNV');
            $table->string('DescriptionNV')->nullable();
            $table->string('StatusNV')->nullable();
            $table->timestamps();

            // Self-referencing foreign key for parent niveau
            $table->foreign('SubMatriculeNV')->references('MatriculeNV')->on('niveaux')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        Schema::dropIfExists('niveaux');
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    }
};
