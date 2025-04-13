<?php

namespace Database\Factories;

use App\Models\Note;
use App\Models\Etudiant;
use App\Models\Matiere;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Note>
 */
class NoteFactory extends Factory
{
    protected $model = Note::class;
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            // 'matriculeNt' handled by trait
            'matriculeEt' => Etudiant::factory(),
            'matriculeMt' => Matiere::factory(),
            'gradeNt' => $this->faker->randomFloat(2, 0, 20), // Assuming a default max grade of 20
            'commentaireNt' => $this->faker->optional()->sentence(),
        ];
    }

    /**
     * Assign a specific Etudiant.
     */
    public function forEtudiant(string $etudiantMatricule): static
    {
        return $this->state(fn (array $attributes) => [
            'matriculeEt' => $etudiantMatricule,
        ]);
    }

    /**
     * Assign a specific Matiere.
     */
    public function forMatiere(string $matiereMatricule): static
    {
        return $this->state(fn (array $attributes) => [
            'matriculeMt' => $matiereMatricule,
        ]);
    }
}
