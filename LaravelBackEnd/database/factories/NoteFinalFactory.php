<?php

namespace Database\Factories;

use App\Models\NoteFinal;
use App\Models\Etudiant;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\NoteFinal>
 */
class NoteFinalFactory extends Factory
{
    protected $model = NoteFinal::class;
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            // 'matriculeNF' handled by trait
            'MatriculeET' => Etudiant::factory(),
            'GradeNF' => $this->faker->randomFloat(2, 5, 20), // Final grade, maybe slightly higher avg
            'CommentaireNF' => $this->faker->optional()->sentence(),
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
}
