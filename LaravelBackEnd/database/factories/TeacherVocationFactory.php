<?php

namespace Database\Factories;

use App\Models\TeacherVocation;
use App\Models\Professeur;
use Illuminate\Database\Eloquent\Factories\Factory;
use Carbon\Carbon;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TeacherVocation>
 */
class TeacherVocationFactory extends Factory
{
    protected $model = TeacherVocation::class;
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $startDate = $this->faker->dateTimeBetween('-3 months', '+3 months');
        $duration = $this->faker->numberBetween(1, 21); // Vocation 1-21 days
        $endDate = Carbon::instance($startDate)->addDays($duration - 1);

        return [
            // 'matriculeTv' handled by trait
            'matriculePr' => Professeur::factory(),
            'startDatetv' => $startDate->format('Y-m-d'),
            'approvedTv' => $this->faker->boolean(80), // 80% chance approved
            'endDatetv' => $endDate->format('Y-m-d'),
        ];
    }

     /**
     * Assign a specific Professeur.
     */
    public function forProfesseur(string $professeurMatricule): static
    {
        return $this->state(fn (array $attributes) => [
            'matriculePr' => $professeurMatricule,
        ]);
    }
}
