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
            // 'MatriculeGA' handled by trait
            'TypeGA' => $this->faker->randomElement(['Bonus', 'Penalty', 'Correction']),
            'ValueGA' => $this->faker->randomFloat(2, -5, 5), // Adjustment value +/- 5 points
            'ReasonGA' => $this->faker->optional()->sentence(),
            'DateGA' => $this->faker->dateTimeThisMonth()->format('Y-m-d'),
            'MatriculeER' => EvaluationResult::factory(), // Link to an EvaluationResult
        ];
    }

    /**
     * Assign a specific EvaluationResult.
     */
    public function forEvaluationResult(string $resultMatricule): static
    {
        return $this->state(fn (array $attributes) => [
            'MatriculeER' => $resultMatricule,
        ]);
    }
}
