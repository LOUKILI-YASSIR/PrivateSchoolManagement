<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Etudiant;
use App\Models\Group; // Import Group model
use App\Models\Niveau; // Import Niveau model

class EtudiantSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all existing groups and niveaux
        $groups = Group::all();
        $niveaux = Niveau::all();

        if ($niveaux->isEmpty()) {
            $this->command->warn('No niveaux found. Skipping EtudiantSeeder. Please run NiveauSeeder first.');
            return;
        }

        // Create 20 Etudiants and assign them randomly to existing niveaux
        // Groups are optional, so we'll randomly assign them to some students
        Etudiant::factory(20)->make()->each(function ($etudiant) use ($groups, $niveaux) {
            $etudiant->MatriculeNV = $niveaux->random()->MatriculeNV;

            // Randomly assign a group to some students (about 70% of them)
            if ($groups->isNotEmpty() && rand(1, 100) <= 70) {
            $etudiant->MatriculeGP = $groups->random()->MatriculeGP;
            }

            $etudiant->save();
        });

        // Alternative: Create a specific number of students per group
        /*
        foreach ($groups as $group) {
            Etudiant::factory(10)->forGroup($group->MatriculeGP)->create();
        }
        */
    }
}
