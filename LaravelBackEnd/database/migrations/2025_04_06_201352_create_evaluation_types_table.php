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
        Schema::create('evaluation_types', function (Blueprint $table) {
            $table->string('matriculeEp')->primary();
            $table->string('nameEp');
            $table->float('max_gradeEp')->nullable();
            $table->float('porsentageEp')->nullable();
            $table->string('descriptionEp')->nullable();
            $table->string('codeEp');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('evaluation_types');
    }
};
