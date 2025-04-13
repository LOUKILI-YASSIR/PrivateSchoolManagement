<?php

namespace Database\Factories;

use App\Models\GradeAdjustment;
use App\Models\EvaluationResult;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\GradeAdjustment>
 */
class GradeAdjustmentFactory extends Factory
{
    protected $model = GradeAdjustment::class;
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            // 'matriculeGA' handled by trait
            'typeGA' => $this->faker->randomElement(['Bonus', 'Penalty', 'Correction']),
            'valueGA' => $this->faker->randomFloat(2, -5, 5), // Adjustment value +/- 5 points
            'reasonGA' => $this->faker->optional()->sentence(),
            'DateGa' => $this->faker->dateTimeThisMonth()->format('Y-m-d'),
            'matriculeER' => EvaluationResult::factory(), // Link to an EvaluationResult
        ];
    }

    /**
     * Assign a specific EvaluationResult.
     */
    public function forEvaluationResult(string $resultMatricule): static
    {
        return $this->state(fn (array $attributes) => [
            'matriculeER' => $resultMatricule,
        ]);
    }
}
