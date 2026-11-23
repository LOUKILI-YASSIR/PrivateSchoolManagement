<?php

namespace Database\Seeders;

use App\Models\Etudiant;
use App\Models\Matiere;
use App\Models\Note;
use Illuminate\Database\Seeder;

class NoteSeeder extends Seeder
{
    public function run(): void
    {
        $etudiants = Etudiant::all();
        $matieres = Matiere::all();

        if ($etudiants->isEmpty() || $matieres->isEmpty()) {
            $this->command?->warn('Students or matieres missing. Run their seeders first.');
            return;
        }

        foreach ($etudiants as $etudiant) {
            // Use MatriculeNV directly; a student is not required to belong
            // to a group to receive notes for the matching level.
            $relevant = $matieres->where('MatriculeNV', $etudiant->MatriculeNV);
            if ($relevant->isEmpty()) {
                continue;
            }

            foreach ($relevant->shuffle()->take((int) ceil($relevant->count() / 2)) as $matiere) {
                $exists = Note::where('MatriculeET', $etudiant->MatriculeET)
                    ->where('MatriculeMT', $matiere->MatriculeMT)
                    ->exists();

                if (!$exists) {
                    Note::factory()
                        ->forEtudiant($etudiant->MatriculeET)
                        ->forMatiere($matiere->MatriculeMT)
                        ->create(['MatriculeYR' => $etudiant->MatriculeYR]);
                }
            }
        }
    }
}
