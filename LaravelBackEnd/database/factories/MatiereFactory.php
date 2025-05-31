<?php

namespace Database\Factories;

use App\Models\Matiere;
use App\Models\Niveau;
use App\Models\Professeur;
use App\Models\AcademicYear;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Matiere>
 */
class MatiereFactory extends Factory
{
    protected $model = Matiere::class;
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            // 'MatriculeMT' handled by trait
            'MatriculeYR' => AcademicYear::factory(),
            'NameMT' => $this->faker->words(3, true),
            'CodeMT' => strtoupper($this->faker->bothify('??###')),
            'DescriptionMT' => $this->faker->sentence(),
            'CoefficientMT' => $this->faker->randomFloat(1, 1, 4),
            'MatriculeNV' => Niveau::factory(),
        ];
    }

    /**
     * Assign a specific Niveau.
     */
    public function forNiveau(string $niveauMatricule): static
    {
        return $this->state(fn (array $attributes) => [
            'MatriculeNV' => $niveauMatricule,
        ]);
    }

}
