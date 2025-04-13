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
        Schema::create('groups', function (Blueprint $table) {
            $table->string('matriculeGp')->primary();
            $table->string('NameGp');
            $table->string('descriptionGp')->nullable();
            $table->string('statusGp')->nullable();
            $table->string('matriculeNv');
            $table->timestamps();

            $table->foreign('matriculeNv')->references('matriculeNv')->on('niveaux')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('groups');
    }
};
