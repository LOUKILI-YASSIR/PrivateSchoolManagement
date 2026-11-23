<?php

namespace Database\Seeders;

use App\Models\Evaluation;
use App\Models\EvaluationType;
use App\Models\Matiere;
use Illuminate\Database\Seeder;

class EvaluationSeeder extends Seeder
{
    public function run(): void
    {
        $matieres = Matiere::all();
        $types = EvaluationType::all();

        if ($matieres->isEmpty() || $types->isEmpty()) {
            $this->command?->warn('Matieres or evaluation types missing. Run their seeders first.');
            return;
        }

        foreach ($matieres as $matiere) {
            foreach ($types->shuffle()->take(min(3, $types->count())) as $type) {
                $exists = Evaluation::where('MatriculeMT', $matiere->MatriculeMT)
                    ->where('MatriculeEP', $type->MatriculeEP)
                    ->exists();

                if (!$exists) {
                    Evaluation::factory()
                        ->forMatiere($matiere->MatriculeMT)
                        ->forEvaluationType($type->MatriculeEP)
                        ->create([
                            'MatriculeYR' => $matiere->MatriculeYR,
                            'NbrEV' => 1,
                        ]);
                }
            }
        }
    }
}
