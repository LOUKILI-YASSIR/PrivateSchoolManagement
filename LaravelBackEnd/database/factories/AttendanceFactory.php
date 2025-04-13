<?php

namespace Database\Factories;

use App\Models\Attendance;
use App\Models\User;
use App\Models\Etudiant;
use App\Models\Professeur;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Attendance>
 */
class AttendanceFactory extends Factory
{
    protected $model = Attendance::class;
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $status = $this->faker->randomElement(['Present', 'Absent', 'Late', 'Excused']);
        $isJustified = ($status === 'Absent' || $status === 'Excused') ? $this->faker->boolean(70) : false;

        return [
            // 'matriculeAt' handled by trait
            'statusAt' => $status,
            'isJustifAt' => $isJustified,
            'justifAt' => $isJustified ? $this->faker->sentence() : null,
            'DateAt' => $this->faker->dateTimeThisMonth()->format('Y-m-d'),
            // We need to link EITHER Etudiant OR Professeur, not both usually.
            // The seeder should handle assigning the correct one.
            'matriculeUt' => User::factory(), // Associated user (can be derived from Etudiant/Professeur)
            'matriculeEt' => null,
            'matriculePr' => null,
        ];
    }

    /**
     * Assign a specific Etudiant and their User.
     */
    public function forEtudiant(string $etudiantMatricule): static
    {
        $etudiant = Etudiant::find($etudiantMatricule);
        return $this->state(fn (array $attributes) => [
            'matriculeEt' => $etudiantMatricule,
            'matriculePr' => null,
            'matriculeUt' => $etudiant?->matriculeUt, // Link the student's user account
        ]);
    }

    /**
     * Assign a specific Professeur and their User.
     */
    public function forProfesseur(string $professeurMatricule): static
    {
        $professeur = Professeur::find($professeurMatricule);
        return $this->state(fn (array $attributes) => [
            'matriculePr' => $professeurMatricule,
            'matriculeEt' => null,
            'matriculeUt' => $professeur?->matriculeUt, // Link the professor's user account
        ]);
    }
}
