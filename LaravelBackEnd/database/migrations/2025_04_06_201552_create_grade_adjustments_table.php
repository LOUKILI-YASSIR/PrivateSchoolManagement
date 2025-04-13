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
        Schema::create('grade_adjustments', function (Blueprint $table) {
            $table->string('matriculeGA')->primary();
            $table->string('typeGA');
            $table->float('valueGA');
            $table->string('reasonGA')->nullable();
            $table->date('DateGa');
            $table->string('matriculeER'); // FK to evaluation_results
            $table->timestamps();

            $table->foreign('matriculeER')->references('matriculeER')->on('evaluation_results')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('grade_adjustments');
    }
};
