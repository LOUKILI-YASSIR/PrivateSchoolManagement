<?php

namespace Database\Factories;

use App\Models\Evaluation;
use App\Models\Matiere;
use App\Models\EvaluationType;
use App\Models\AcademicYear;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Evaluation>
 */
class EvaluationFactory extends Factory
{
    protected $model = Evaluation::class;
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'MatriculeYR' => AcademicYear::factory(),
            'MatriculeMT' => Matiere::factory(),
            'MatriculeEP' => EvaluationType::factory(),
            'NbrEV' => $this->faker->numberBetween(1, 5), // e.g., Evaluation #1, #2 etc.
        ];
    }

    /**
     * Assign a specific Matiere.
     */
    public function forMatiere(string $matiereMatricule): static
    {
        return $this->state(fn (array $attributes) => [
            'MatriculeMT' => $matiereMatricule,
        ]);
    }

    /**
     * Assign a specific EvaluationType.
     */
    public function forEvaluationType(string $typeMatricule): static
    {
        return $this->state(fn (array $attributes) => [
            'MatriculeEP' => $typeMatricule,
        ]);
    }
}
