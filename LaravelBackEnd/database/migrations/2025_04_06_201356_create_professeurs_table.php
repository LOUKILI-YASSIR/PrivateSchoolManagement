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
        Schema::create('professeurs', function (Blueprint $table) {
            $table->string('MatriculePR')->primary();
            $table->string('CINPR')->unique();
            $table->string('CivilitePR')->nullable();
            $table->string('Phone1PR')->nullable();
            $table->string('Phone2PR')->nullable();
            $table->date('DateEmbauchePR')->nullable();
            $table->float('SalairePR')->nullable();
            $table->string('NomBanquePR')->nullable();
            $table->string('RIBPR')->nullable();
            $table->string('MatriculeUT');
            $table->timestamps();

            $table->foreign('MatriculeUT')->references('MatriculeUT')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        Schema::dropIfExists('professeurs');
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    }
};
