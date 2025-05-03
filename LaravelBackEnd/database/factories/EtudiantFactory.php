<?php

namespace Database\Factories;

use App\Models\Etudiant;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Etudiant>
 */
class EtudiantFactory extends Factory
{
    protected $model = Etudiant::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Create a User with the 'etudiant' role/status first
        $user = User::factory()->etudiant()->create();

        return [
            // 'MatriculeET' is handled by GeneratesMatricule trait
            'MatriculeUT' => $user->MatriculeUT, // Assign the created user's ID
            // 'MatriculeGP' will be set in the Seeder or via state
            'EmailET' => $user->emailUT, // Use the user's email by default
            'PhoneET' => $user->phoneUT, // Use the user's phone by default
            'LienParenteTR' => $this->faker->randomElement(['Father', 'Mother', 'Guardian', 'Sibling']),
            'ProfessionTR' => $this->faker->optional()->jobTitle(),
            'NomTR' => $this->faker->lastName(),
            'PrenomTR' => $this->faker->firstName(),
            'Phone1TR' => $this->faker->phoneNumber(),
            'Phone2TR' => $this->faker->optional()->phoneNumber(),
            'EmailTR' => $this->faker->optional()->safeEmail(),
            'ObservationTR' => $this->faker->optional()->paragraph(),
        ];
    }

    /**
     * Assign a specific group to the student.
     *
     * @param string $groupMatricule
     * @return static
     */
    public function forGroup(string $groupMatricule): static
    {
        return $this->state(fn (array $attributes) => [
            'MatriculeGP' => $groupMatricule,
        ]);
    }
}
