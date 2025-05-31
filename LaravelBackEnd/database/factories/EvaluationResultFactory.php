<?php

namespace Database\Factories;

use App\Models\EvaluationResult;
use App\Models\Etudiant;
use App\Models\Evaluation;
use App\Models\AcademicYear;
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
        return [
            // 'MatriculeER' handled by trait
            'MatriculeYR' => AcademicYear::factory(),
            'MatriculeET' => Etudiant::factory(),
            'MatriculeEV' => Evaluation::factory(),
            'GradeER' => $this->faker->randomFloat(2, 0, 20),
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
