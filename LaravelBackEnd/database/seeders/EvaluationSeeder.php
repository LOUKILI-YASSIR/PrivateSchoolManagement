<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Evaluation;
use App\Models\Matiere;
use App\Models\EvaluationType;

class EvaluationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $matieres = Matiere::all();
        $evaluationTypes = EvaluationType::all();

        if ($matieres->isEmpty() || $evaluationTypes->isEmpty()) {
            $this->command->warn('Matieres or EvaluationTypes not found. Skipping EvaluationSeeder.');
            return;
        }

        // Create 1-3 evaluations for each Matiere using different types
        foreach ($matieres as $matiere) {
            $typesToUse = $evaluationTypes->random(rand(1, min(3, $evaluationTypes->count())));
            foreach ($typesToUse as $type) {
                Evaluation::factory()
                    ->forMatiere($matiere->MatriculeMT)
                    ->forEvaluationType($type->MatriculeEP)
                    ->create([
                        // Assign a sequence number if multiple evaluations of the same type exist for a matiere
                        // This simple version doesn't track that, assumes NbrEV is just informational
                        'NbrEV' => rand(1, 3)
                    ]);
            }
        }
    }
}
