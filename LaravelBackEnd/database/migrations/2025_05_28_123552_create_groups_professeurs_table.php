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
        Schema::create('groups_professeurs', function (Blueprint $table) {
            $table->id("MatriculePG");
            $table->string("MatriculeGP");
            $table->string("MatriculePR");
            $table->foreign("MatriculeGP")->references("MatriculeGP")->on("groups")->onDelete("cascade");
            $table->foreign("MatriculePR")->references("MatriculePR")->on("professeurs")->onDelete("cascade");
            $table->primary(["MatriculePG","MatriculeGP","MatriculePR"]);
            $table->unique(['MatriculePR', 'MatriculeGP']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('groups_professeurs');
    }
};
