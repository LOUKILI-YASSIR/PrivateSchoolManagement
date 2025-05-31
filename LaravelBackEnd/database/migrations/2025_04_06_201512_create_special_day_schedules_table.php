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
        Schema::create('special_day_schedules', function (Blueprint $table) {
            $table->string('MatriculeSS')->primary();
            $table->date('DateSS');
            $table->boolean('IsFulldaySS')->default(false);
            $table->string('MatriculeTS')->nullable();
            $table->string('LocationSS')->nullable();
            $table->string('ActivityNameSS')->nullable();
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
        Schema::table('special_day_schedules', function (Blueprint $table) {
            $foreignKeys = collect(Schema::getConnection()->getDoctrineSchemaManager()->listTableForeignKeys('special_day_schedules'));
            if ($foreignKeys->contains(function ($fk) {
                return $fk->getColumns() === ['MatriculeTS'] && $fk->getForeignTableName() === 'time_slots';
            })) {
                 $table->dropForeign(['MatriculeTS']);
            }
        });
        Schema::dropIfExists('special_day_schedules');
    }
};
