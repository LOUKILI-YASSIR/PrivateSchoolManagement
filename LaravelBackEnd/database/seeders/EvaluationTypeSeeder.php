<?php

namespace Database\Seeders;

use App\Models\EvaluationType;
use Illuminate\Database\Seeder;

class EvaluationTypeSeeder extends Seeder
{
    public function run(): void
    {
        if (EvaluationType::query()->exists()) {
            $this->command?->warn('Evaluation types already exist. Skipping to avoid duplicates.');
            return;
        }

        EvaluationType::factory()->count(6)->create();
    }
}
