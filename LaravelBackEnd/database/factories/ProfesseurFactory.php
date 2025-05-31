<?php

namespace Database\Factories;

use App\Models\Professeur;
use App\Models\User;
use App\Models\AcademicYear;
use App\Models\Matiere;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Professeur>
 */
class ProfesseurFactory extends Factory
{
    protected $model = Professeur::class;
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            // 'MatriculePR' handled by trait
            'MatriculeYR' => AcademicYear::factory(),
            'CINPR' => $this->faker->unique()->numerify('########'),
            'CivilitePR' => $this->faker->randomElement(['Mr', 'Mrs', 'Ms', 'Dr']),
            'DateEmbauchePR' => $this->faker->dateTimeBetween('-5 years', 'now'),
            'SalairePR' => $this->faker->randomFloat(2, 3000, 10000),
            'NomBanquePR' => $this->faker->company(),
            'RIBPR' => $this->faker->iban(),
            'MatriculeUT' => User::factory(),
            'MatriculeMT' => Matiere::factory(),
        ];
    }

    /**
     * Configure the model factory.
     *
     * @return $this
     */
    // public function configure(): static // Remove this method
    // {
    //     return $this->afterCreating(function (Professeur $professeur) {
    //         // If no user is associated, create one with the professeur state
    //         if (!$professeur->user) {
    //             $user = User::factory()->professeur()->create();
    //             $professeur->update(['MatriculeUT' => $user->MatriculeUT]);
    //         }
    //     });
    // }
}
