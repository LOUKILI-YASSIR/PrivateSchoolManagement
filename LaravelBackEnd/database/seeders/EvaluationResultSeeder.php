<?php

namespace Database\Seeders;

use App\Models\Etudiant;
use App\Models\Evaluation;
use App\Models\EvaluationResult;
use Illuminate\Database\Seeder;

class EvaluationResultSeeder extends Seeder
{
    public function run(): void
    {
        $evaluations = Evaluation::with('matiere')->get();
        $etudiants = Etudiant::all();

        if ($evaluations->isEmpty() || $etudiants->isEmpty()) {
            $this->command?->warn('Evaluations or students missing. Run their seeders first.');
            return;
        }

        foreach ($evaluations as $evaluation) {
            $niveauId = $evaluation->matiere?->MatriculeNV;
            if (!$niveauId) {
                continue;
            }

            $relevantStudents = $etudiants->where('MatriculeNV', $niveauId);

            foreach ($relevantStudents as $etudiant) {
                $exists = EvaluationResult::where('MatriculeET', $etudiant->MatriculeET)
                    ->where('MatriculeEV', $evaluation->MatriculeEV)
                    ->exists();

                if (!$exists) {
                    EvaluationResult::factory()
                        ->forEtudiant($etudiant->MatriculeET)
                        ->forEvaluation($evaluation->MatriculeEV)
                        ->create(['MatriculeYR' => $evaluation->MatriculeYR]);
                }
            }
        }
    }
}
