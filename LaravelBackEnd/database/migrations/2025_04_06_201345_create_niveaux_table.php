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
            $table->string('matriculeNv')->primary();
            $table->string('codeNv');
            $table->string('NomNv');
            $table->string('parent_matriculeNv')->nullable();
            $table->string('typeNv');
            $table->string('descriptionNv')->nullable();
            $table->string('statusNv')->nullable();
            $table->timestamps();

            // Self-referencing foreign key for parent niveau
            $table->foreign('parent_matriculeNv')->references('matriculeNv')->on('niveaux')->onDelete('set null');
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
