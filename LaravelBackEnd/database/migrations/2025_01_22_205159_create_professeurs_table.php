<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Migration
class CreateProfesseursTable extends Migration
{
    public function up()
    {
        Schema::create('professeurs', function (Blueprint $table) {
            $table->string('matriculePr', 20)->primary();
            $table->string('image_urlPr', 2083)->nullable();
            $table->string('civilitePr', 4);
            $table->string('nomPr', 50);
            $table->string('prenomPr', 30);
            $table->string('nationalitePr', 60)->nullable();
            $table->string('CINPr', 20)->nullable();
            $table->date('DateNaissancePr');
            $table->string('adressePr', 150)->nullable();
            $table->string('villePr', 100)->nullable();
            $table->integer('CodePostalPr')->nullable();
            $table->string('paysPr', 60)->nullable();
            $table->string('emailPr', 100)->unique();
            $table->string('Telephone1Pr', 20)->nullable();
            $table->string('Telephone2Pr', 20)->nullable();
            $table->date('dateEmbauchePr');
            $table->decimal('salairePr', 10, 2)->check('salairePr >= 0');
            $table->string('NomBanquePr', 100)->nullable();
            $table->string('RIBPr', 34)->nullable();
            $table->text('observationPr')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('professeurs');
    }
}
