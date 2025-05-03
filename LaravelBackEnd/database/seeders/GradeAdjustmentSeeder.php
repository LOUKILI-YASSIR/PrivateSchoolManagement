<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\GradeAdjustment;
use App\Models\EvaluationResult;

class GradeAdjustmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $evaluationResults = EvaluationResult::all();

        if ($evaluationResults->isEmpty()) {
            $this->command->warn('No EvaluationResults found. Skipping GradeAdjustmentSeeder.');
            return;
        }

        // Create adjustments for a small subset (e.g., 10%) of evaluation results
        $resultsToAdjust = $evaluationResults->random(ceil($evaluationResults->count() * 0.1));

        foreach ($resultsToAdjust as $result) {
            GradeAdjustment::factory()
                ->forEvaluationResult($result->MatriculeER)
                ->create();
        }
    }
}
