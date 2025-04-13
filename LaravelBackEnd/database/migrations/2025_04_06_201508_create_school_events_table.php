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
        Schema::create('school_events', function (Blueprint $table) {
            $table->string('matriculeSe')->primary();
            $table->string('nameSe');
            $table->string('descriptionSe')->nullable();
            $table->boolean('isFulldaySe')->default(false);
            $table->string('locationSe')->nullable();
            $table->date('dateSe');
            $table->string('matriculeTs')->nullable();
            $table->timestamps();

            $table->foreign('matriculeTs')->references('matriculeTs')->on('time_slots')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('school_events', function (Blueprint $table) {
            $foreignKeys = collect(Schema::getConnection()->getDoctrineSchemaManager()->listTableForeignKeys('school_events'));
            if ($foreignKeys->contains(function ($fk) {
                return $fk->getColumns() === ['matriculeTs'] && $fk->getForeignTableName() === 'time_slots';
            })) {
                $table->dropForeign(['matriculeTs']);
            }
        });
        Schema::dropIfExists('school_events');
    }
};
