<?php

namespace Database\Factories;

use App\Models\Attendance;
use App\Models\User;
use App\Models\Etudiant;
use App\Models\Professeur;
use App\Models\AcademicYear;
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
            // 'MatriculeAT' handled by trait
            'MatriculeYR' => AcademicYear::factory(),
            'StatusAT' => $status,
            'IsJustifAT' => $isJustified,
            'JustifAT' => $isJustified ? $this->faker->sentence() : null,
            'DateAT' => $this->faker->dateTimeThisMonth()->format('Y-m-d'),
            // We need to link EITHER Etudiant OR Professeur, not both usually.
            // The seeder should handle assigning the correct one.
            'MatriculeUT' => User::factory(), // Associated user (can be derived from Etudiant/Professeur)
            'MatriculeET' => null,
            'MatriculePR' => null,
        ];
    }

    /**
     * Assign a specific Etudiant and their User.
     */
    public function forEtudiant(string $etudiantMatricule): static
    {
        $etudiant = Etudiant::find($etudiantMatricule);
        return $this->state(fn (array $attributes) => [
            'MatriculeET' => $etudiantMatricule,
            'MatriculePR' => null,
            'MatriculeUT' => $etudiant?->MatriculeUT, // Link the student's user account
        ]);
    }

    /**
     * Assign a specific Professeur and their User.
     */
    public function forProfesseur(string $professeurMatricule): static
    {
        $professeur = Professeur::find($professeurMatricule);
        return $this->state(fn (array $attributes) => [
            'MatriculePR' => $professeurMatricule,
            'MatriculeET' => null,
            'MatriculeUT' => $professeur?->MatriculeUT, // Link the professor's user account
        ]);
    }
}
