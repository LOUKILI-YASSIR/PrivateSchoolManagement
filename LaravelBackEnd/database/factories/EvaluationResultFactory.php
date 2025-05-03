<?php

namespace Database\Factories;

use App\Models\EvaluationResult;
use App\Models\Etudiant;
use App\Models\Evaluation;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\EvaluationResult>
 */
class EvaluationResultFactory extends Factory
{
    protected $model = EvaluationResult::class;
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Get an existing evaluation to determine max grade
        $evaluation = Evaluation::factory()->create(); // Create one if none passed
        $maxGrade = $evaluation->evaluationType->MaxGradeEP ?? 20; // Default max 20

        return [
            // 'MatriculeER' handled by trait
            'MatriculeET' => Etudiant::factory(),
            'MatriculeEV' => $evaluation->MatriculeEV,
            'GradeER' => $this->faker->randomFloat(2, 0, $maxGrade), // Grade based on evaluation type max
            'CommentaireER' => $this->faker->optional()->sentence(),
        ];
    }

    /**
     * Assign a specific Etudiant.
     */
    public function forEtudiant(string $etudiantMatricule): static
    {
        return $this->state(fn (array $attributes) => [
            'MatriculeET' => $etudiantMatricule,
        ]);
    }

    /**
     * Assign a specific Evaluation and derive max grade.
     */
    public function forEvaluation(string $evaluationMatricule): static
    {
        $evaluation = Evaluation::find($evaluationMatricule);
        $maxGrade = $evaluation?->evaluationType?->MaxGradeEP ?? 20;

        return $this->state(fn (array $attributes) => [
            'MatriculeEV' => $evaluationMatricule,
            'GradeER' => $this->faker->randomFloat(2, 0, $maxGrade),
        ]);
    }
}
