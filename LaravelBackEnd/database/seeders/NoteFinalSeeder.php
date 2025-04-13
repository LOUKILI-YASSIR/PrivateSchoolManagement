<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\NoteFinal;
use App\Models\Etudiant;

class NoteFinalSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $etudiants = Etudiant::all();

        if ($etudiants->isEmpty()) {
            $this->command->warn('No Etudiants found. Skipping NoteFinalSeeder.');
            return;
        }

        // Create one NoteFinal for each Etudiant
        foreach ($etudiants as $etudiant) {
             // Avoid creating duplicate final notes
            if (!NoteFinal::where('matriculeEt', $etudiant->matriculeEt)->exists()) {
                NoteFinal::factory()
                    ->forEtudiant($etudiant->matriculeEt)
                    ->create();
            }
        }
    }
}
