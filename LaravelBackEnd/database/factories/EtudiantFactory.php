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
            // 'matriculeEt' is handled by GeneratesMatricule trait
            'matriculeUt' => $user->matriculeUt, // Assign the created user's ID
            // 'matriculeGp' will be set in the Seeder or via state
            'emailEt' => $user->emailUt, // Use the user's email by default
            'phoneEt' => $user->phoneUt, // Use the user's phone by default
            'lienParenteTr' => $this->faker->randomElement(['Father', 'Mother', 'Guardian', 'Sibling']),
            'professionTr' => $this->faker->optional()->jobTitle(),
            'NomTr' => $this->faker->lastName(),
            'PrenomTr' => $this->faker->firstName(),
            'Phone1Tr' => $this->faker->phoneNumber(),
            'Phone2Tr' => $this->faker->optional()->phoneNumber(),
            'EmailTr' => $this->faker->optional()->safeEmail(),
            'ObservationTr' => $this->faker->optional()->paragraph(),
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
            'matriculeGp' => $groupMatricule,
        ]);
    }
}
