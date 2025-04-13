<?php

namespace Database\Factories;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    protected $model = User::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $username = $this->faker->unique()->userName(); // Generate username once
        $currentYear = Carbon::now()->year; // Get current year
        $defaultPassword = "YLSchool@2025"; // Construct default password string

        // Define country codes and their major cities
        $countries = [
            'MA' => ['Casablanca', 'Rabat', 'Fes', 'Marrakech', 'Tanger'],
            'FR' => ['Paris', 'Lyon', 'Marseille', 'Bordeaux', 'Nice'],
            'US' => ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Miami'],
            'GB' => ['London', 'Manchester', 'Birmingham', 'Liverpool', 'Edinburgh'],
            'ES' => ['Madrid', 'Barcelona', 'Valencia', 'Seville', 'Bilbao'],
        ];

        // Randomly select a country and its cities
        $countryCode = $this->faker->randomElement(array_keys($countries));
        $cities = $countries[$countryCode];

        return [
            // 'matriculeUt' is handled by GeneratesMatricule trait
            'NomPl' => $this->faker->lastName(),
            'PrenomPl' => $this->faker->firstName(),
            'usernameUt' => $username, // Use the generated username
            'emailUt' => "{$username}@ylschool-et.com", // Default email for etudiant
            'phoneUt' => $this->faker->optional()->phoneNumber(),
            'passwordUt' => Hash::make($defaultPassword), // Hash the default password
            'roleUt' => 'etudiant', // Default role is etudiant
            'statutUt' => 'offline', // Default status is offline
            'genrePl' => $this->faker->randomElement(['Homme', 'Femelle']),
            'adressPl' => $this->faker->optional()->address(),
            'villePl' => $this->faker->randomElement($cities),
            'codePostalPl' => $this->faker->optional()->postcode(),
            'paysPl' => $countryCode,
            'nationalitePl' => $countryCode,
            'lieuNaissancePl' => $this->faker->randomElement($cities),
            'dateNaissancePl' => $this->faker->optional()->date(),
            'ObservationPl' => $this->faker->optional()->paragraph(),
            'profileFileNamePl' => null, // Default to null
            'email_verified_at' => now(), // Assuming users are verified by default for seeding
            'remember_token' => Str::random(10),
        ];
    }

    /**
     * Indicate that the user is an administrator.
     */
    public function admin(): static
    {
        return $this->state(fn (array $attributes) => [
            'roleUt' => 'admin', // Corrected: Set roleUt to admin
            // Override email domain for admin
            'emailUt' => "{$attributes['usernameUt']}@ylschool.com",
        ]);
    }

    /**
     * Indicate that the user is a professor.
     */
    public function professeur(): static
    {
        return $this->state(fn (array $attributes) => [
            'roleUt' => 'professeur', // Corrected: Set roleUt to professeur
            // Override email domain for professeur
            'emailUt' => "{$attributes['usernameUt']}@ylschool-pr.com",
        ]);
    }

    /**
     * Indicate that the user is an etudiant.
     */
    public function etudiant(): static
    {
        return $this->state(fn (array $attributes) => [
            'roleUt' => 'etudiant', // Corrected: Set roleUt to etudiant
        ]);
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}
