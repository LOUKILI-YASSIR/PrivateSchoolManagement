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
            $table->string('MatriculeEP')->primary();
            $table->string('NameEP');
            $table->float('MaxGradeEP')->nullable();
            $table->float('PorsentageEP')->nullable();
            $table->string('DescriptionEP')->nullable();
            $table->string('CodeEP');
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
