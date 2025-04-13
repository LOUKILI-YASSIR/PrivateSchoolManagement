<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Note;
use App\Models\Etudiant;
use App\Models\Matiere;

class NoteSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $etudiants = Etudiant::all();
        $matieres = Matiere::all();

        if ($etudiants->isEmpty() || $matieres->isEmpty()) {
            $this->command->warn('Etudiants or Matieres not found. Skipping NoteSeeder.');
            return;
        }

        // Create one Note per Etudiant for a random selection of Matieres they might be taking
        foreach ($etudiants as $etudiant) {
            // Find matieres relevant to the student's group's niveau
            $relevantMatieres = $matieres->where('matriculeNv', $etudiant->group?->matriculeNv);
            if($relevantMatieres->isEmpty()) continue;

            // Assign a note for ~50% of relevant matieres
            $matieresToGrade = $relevantMatieres->random(ceil($relevantMatieres->count() / 2));

            foreach ($matieresToGrade as $matiere) {
                 // Avoid creating duplicate notes for the same student/matiere pair
                if (!Note::where('matriculeEt', $etudiant->matriculeEt)->where('matriculeMt', $matiere->matriculeMt)->exists()) {
                    Note::factory()
                        ->forEtudiant($etudiant->matriculeEt)
                        ->forMatiere($matiere->matriculeMt)
                        ->create();
                }
            }
        }
    }
}
