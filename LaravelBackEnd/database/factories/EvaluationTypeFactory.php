<?php

namespace Database\Factories;

use App\Models\EvaluationType;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\EvaluationType>
 */
class EvaluationTypeFactory extends Factory
{
    protected $model = EvaluationType::class;
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            // 'matriculeEp' is handled by the GeneratesMatricule trait
            'nameEp' => $this->faker->randomElement(['Quiz', 'Midterm Exam', 'Final Exam', 'Project', 'Homework', 'Participation']),
            'max_gradeEp' => $this->faker->randomElement([10, 20, 50, 100]),
            'descriptionEp' => $this->faker->optional()->sentence(),
            'porsentageEp' => $this->faker->randomFloat(2, 5, 50), // Percentage between 5 and 50
            'codeEp' => $this->faker->bothify('EVT-???###'),
        ];
    }
}
