<?php

namespace Database\Factories;

use App\Models\Professeur;
use App\Models\User;
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
        // Create a User with the 'professeur' role/status first
        $user = User::factory()->professeur()->create();

        return [
            // 'MatriculePR' is handled by GeneratesMatricule trait
            'MatriculeUT' => $user->MatriculeUT, // Assign the created user's ID
            'CINPR' => $this->faker->unique()->numerify('########'), // Assuming 8 digits CIN
            'CivilitePR' => $this->faker->randomElement(['Mr.', 'Mrs.', 'Ms.', 'Dr.']),
            'Phone1PR' => $this->faker->phoneNumber(),
            'Phone2PR' => $this->faker->optional()->phoneNumber(),
            'DateEmbauchePR' => $this->faker->date(),
            'SalairePR' => $this->faker->randomFloat(2, 30000, 150000),
            'NomBanquePR' => $this->faker->optional()->company() . ' Bank',
            'RIBPR' => $this->faker->optional()->iban('MA'), // Generate Moroccan IBAN
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
