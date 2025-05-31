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
            $table->string('MatriculeSE')->primary();
            $table->string('NameSE');
            $table->string('DescriptionSE')->nullable();
            $table->boolean('IsFulldaySE')->default(false);
            $table->string('LocationSE')->nullable();
            $table->date('DateSE');
            $table->string('MatriculeTS')->nullable();
            $table->string('MatriculeYR');
            $table->timestamps();

            $table->foreign('MatriculeTS')->references('MatriculeTS')->on('time_slots')->onDelete('cascade');
            $table->foreign('MatriculeYR')->references('MatriculeYR')->on('academic_years');
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
                return $fk->getColumns() === ['MatriculeTS'] && $fk->getForeignTableName() === 'time_slots';
            })) {
                $table->dropForeign(['MatriculeTS']);
            }
        });
        Schema::dropIfExists('school_events');
    }
};
