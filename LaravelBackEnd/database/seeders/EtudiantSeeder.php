<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Etudiant;
use App\Models\Group; // Import Group model

class EtudiantSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all existing groups
        $groups = Group::all();

        if ($groups->isEmpty()) {
            $this->command->warn('No groups found. Skipping EtudiantSeeder. Please run GroupSeeder first.');
            return;
        }

        // Create 50 Etudiants and assign them randomly to existing groups
        Etudiant::factory(50)->make()->each(function ($etudiant) use ($groups) {
            $etudiant->matriculeGp = $groups->random()->matriculeGp;
            $etudiant->save(); // Save after associating group and letting factory create user
        });

        // Alternative: Create a specific number of students per group
        /*
        foreach ($groups as $group) {
            Etudiant::factory(10)->forGroup($group->matriculeGp)->create();
        }
        */
    }
}
