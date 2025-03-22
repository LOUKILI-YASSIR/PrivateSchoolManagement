<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        // Call individual seeders
        $this->call([
            ProfesseurSeeder::class, // Seed Professeur table first
            EtudiantSeeder::class,  // Seed Etudiant table
            UserSeeder::class
        ]);
    }
}
