<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\EvaluationResult;
use App\Models\Etudiant;
use App\Models\Evaluation;
use App\Models\Group;

class EvaluationResultSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $evaluations = Evaluation::with('matiere.niveau.groups.etudiants')->get(); // Eager load students via groups
        $etudiants = Etudiant::all(); // Fallback if eager loading fails or structure is different

        if ($evaluations->isEmpty()) {
            $this->command->warn('No Evaluations found. Skipping EvaluationResultSeeder.');
            return;
        }
        if ($etudiants->isEmpty()) {
            $this->command->warn('No Etudiants found. Skipping EvaluationResultSeeder.');
            return;
        }

        // For each evaluation, assign a result to each student in the relevant group/niveau
        foreach ($evaluations as $evaluation) {
            // Attempt to get students for this evaluation's matiere's niveau
            $relevantGroups = $evaluation->matiere?->niveau?->groups;
            if ($relevantGroups) {
                $relevantEtudiants = $relevantGroups->flatMap->etudiants;
            } else {
                // Fallback: Use all students (less accurate)
                $relevantEtudiants = $etudiants;
            }


            foreach ($relevantEtudiants as $etudiant) {
                // Avoid creating duplicate results for the same student/evaluation pair
                if (!EvaluationResult::where('MatriculeET', $etudiant->MatriculeET)->where('MatriculeEV', $evaluation->MatriculeEV)->exists()) {
                    EvaluationResult::factory()
                        ->forEtudiant($etudiant->MatriculeET)
                        ->forEvaluation($evaluation->MatriculeEV)
                        ->create();
                }
            }
        }
    }
}
