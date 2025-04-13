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
            $table->string('matriculePr')->primary();
            $table->string('CINPr')->unique();
            $table->string('civilitePr')->nullable();
            $table->string('Phone1Pr')->nullable();
            $table->string('Phone2Pr')->nullable();
            $table->date('DateEmbauchePr')->nullable();
            $table->float('SalairePr')->nullable();
            $table->string('NomBanquePr')->nullable();
            $table->string('RIBPr')->nullable();
            $table->string('matriculeUt');
            $table->timestamps();

            $table->foreign('matriculeUt')->references('matriculeUt')->on('users')->onDelete('cascade');
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
