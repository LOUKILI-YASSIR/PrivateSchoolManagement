<?php

namespace Database\Seeders;

use App\Models\Etudiant;
use App\Models\NoteFinal;
use Illuminate\Database\Seeder;

class NoteFinalSeeder extends Seeder
{
    public function run(): void
    {
        $etudiants = Etudiant::all();

        if ($etudiants->isEmpty()) {
            $this->command?->warn('No students found. Run EtudiantSeeder first.');
            return;
        }

        foreach ($etudiants as $etudiant) {
            if (NoteFinal::where('MatriculeET', $etudiant->MatriculeET)->exists()) {
                continue;
            }

            NoteFinal::factory()
                ->forEtudiant($etudiant->MatriculeET)
                ->create(['MatriculeYR' => $etudiant->MatriculeYR]);
        }
    }
}
