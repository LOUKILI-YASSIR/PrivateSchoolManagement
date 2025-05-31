<?php

namespace Database\Factories;

use App\Models\Note;
use App\Models\Etudiant;
use App\Models\Matiere;
use App\Models\AcademicYear;
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
            // 'MatriculeNT' handled by trait
            'MatriculeYR' => AcademicYear::factory(),
            'MatriculeET' => Etudiant::factory(),
            'MatriculeMT' => Matiere::factory(),
            'GradeNT' => $this->faker->randomFloat(2, 0, 20), // Assuming a default max grade of 20
            'CommentaireNT' => $this->faker->optional()->sentence(),
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
     * Assign a specific Matiere.
     */
    public function forMatiere(string $matiereMatricule): static
    {
        return $this->state(fn (array $attributes) => [
            'MatriculeMT' => $matiereMatricule,
        ]);
    }
}
