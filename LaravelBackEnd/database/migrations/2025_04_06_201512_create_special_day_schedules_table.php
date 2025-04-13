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
            $table->string('matriculeSS')->primary();
            $table->date('dateSS');
            $table->boolean('isFulldaySS')->default(false);
            $table->string('matriculeTs')->nullable();
            $table->string('locationSS')->nullable();
            $table->string('activityNameSS')->nullable();
            $table->timestamps();

            $table->foreign('matriculeTs')->references('matriculeTs')->on('time_slots')->onDelete('cascade');
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
                return $fk->getColumns() === ['matriculeTs'] && $fk->getForeignTableName() === 'time_slots';
            })) {
                 $table->dropForeign(['matriculeTs']);
            }
        });
        Schema::dropIfExists('special_day_schedules');
    }
};
