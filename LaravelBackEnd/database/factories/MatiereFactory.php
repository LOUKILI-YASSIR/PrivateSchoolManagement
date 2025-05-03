<?php

namespace Database\Factories;

use App\Models\Matiere;
use App\Models\Niveau;
use App\Models\Professeur;
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
            'NameMT' => $this->faker->randomElement(['Mathematics', 'Physics', 'Chemistry', 'Biology', 'History', 'Geography', 'Literature', 'Philosophy', 'Computer Science', 'Art']),
            'CodeMT' => $this->faker->bothify('SUB-???###'),
            'DescriptionMT' => $this->faker->optional()->sentence(),
            'CoefficientMT' => $this->faker->randomFloat(1, 0.5, 5.0),
            // Foreign keys will be set in the seeder or using states
            'MatriculeNV' => Niveau::factory(), // Default: create a new Niveau if not specified
            'MatriculePR' => Professeur::factory(), // Default: create a new Professeur if not specified
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

    /**
     * Assign a specific Professeur.
     */
    public function forProfesseur(string $professeurMatricule): static
    {
        return $this->state(fn (array $attributes) => [
            'MatriculePR' => $professeurMatricule,
        ]);
    }
}
