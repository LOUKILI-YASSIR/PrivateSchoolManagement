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
        Schema::create('etudiants', function (Blueprint $table) {
            // Student Information
            $table->string('matriculeEt', 50)->primary();
            $table->string('PROFILE_PICTUREEt', 50);
            $table->string('GENREEt', 7)->check("GENREEt IN ('Homme', 'Femelle')");
            $table->string('NOMEt', 50);
            $table->string('PRENOMEt', 30);
            $table->string('LIEU_NAISSANCEEt', 100);
            $table->date('DATE_NAISSANCEEt');
            $table->string('NATIONALITEEt', 60);
            $table->string('ADRESSEEt', 150);
            $table->string('VILLEEt', 100);
            $table->string('PAYSEt', 60);
            $table->integer('CODE_POSTALEt');
            $table->string('EMAILEt', 100);
            $table->text('OBSERVATIONEt')->nullable();

            // Parent Information
            $table->string('LIEN_PARENTETr', 20);
            $table->string('NOMTr', 50);
            $table->string('PRENOMTr', 30);
            $table->string('PROFESSIONTr', 100);
            $table->string('TELEPHONE1Tr', 20);
            $table->string('TELEPHONE2Tr', 20)->nullable();
            $table->string('EMAILTr', 100);

            // Additional Information
            $table->text('OBSERVATIONTr')->nullable();

            // Timestamps
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('etudiants');
    }
};
