<?php

namespace Database\Seeders;

use App\Models\EvaluationResult;
use App\Models\GradeAdjustment;
use Illuminate\Database\Seeder;

class GradeAdjustmentSeeder extends Seeder
{
    public function run(): void
    {
        $results = EvaluationResult::all();

        if ($results->isEmpty()) {
            $this->command?->warn('No evaluation results found. Run EvaluationResultSeeder first.');
            return;
        }

        $sampleSize = max(1, (int) ceil($results->count() * 0.1));

        foreach ($results->shuffle()->take($sampleSize) as $result) {
            if (GradeAdjustment::where('MatriculeER', $result->MatriculeER)->exists()) {
                continue;
            }

            GradeAdjustment::factory()
                ->forEvaluationResult($result->MatriculeER)
                ->create(['MatriculeYR' => $result->MatriculeYR]);
        }
    }
}
