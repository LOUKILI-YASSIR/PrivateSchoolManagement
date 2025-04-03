<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up()
    {
        Schema::create('matiere', function (Blueprint $table) {
            $table->string("matriculeMat")->primary(); // varchar(255) primary key
            $table->string('name'); // varchar(255) not null
            $table->text('description')->nullable(); // text, nullable
            $table->integer('coefficient'); // int not null
            $table->integer('num_controls'); // int not null
            $table->boolean('has_final_exam')->default(false); // boolean not null default false
            $table->boolean('has_other_grade')->default(false); // boolean not null default false
            $table->boolean('has_monitoring_behavior_grade')->default(false); // boolean not null default false
            $table->timestamps(); // created_at and updated_at
        });

        // Add check constraints (for MySQL 8.0.16+)
        DB::statement('ALTER TABLE matiere ADD CONSTRAINT check_coefficient CHECK (coefficient BETWEEN 1 AND 10)');
        DB::statement('ALTER TABLE matiere ADD CONSTRAINT check_num_controls CHECK (num_controls > 0)');
    }

    public function down()
    {
        Schema::dropIfExists('matiere'); // Fixed typo from 'matieres' to 'matiere' to match table name
    }
};

