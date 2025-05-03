<?php

namespace Database\Factories;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Crypt;
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
        $plainCode = Str::random(27);
        $encryptedCode = Crypt::encryptString($plainCode);
        
        
        return [
            // 'MatriculeUT' is handled by GeneratesMatricule trait
            'NomPL' => $this->faker->lastName(),
            'PrenomPL' => $this->faker->firstName(),
            'UserNameUT' => $username, // Use the generated username
            'EmailUT' => "{$username}@ylschool-et.com", // Default email for etudiant
            'PhoneUT' => $this->faker->optional()->phoneNumber(),
            'PasswordUT' => Hash::make($defaultPassword), // Hash the default password
            'RoleUT' => 'etudiant', // Default role is etudiant
            'CodeVerificationUT' => $encryptedCode, // Random verification code
            'StatutUT' => 'offline', // Default status is offline
            'GenrePL' => $this->faker->randomElement(['Homme', 'Femelle']),
            'AdressPL' => $this->faker->optional()->address(),
            'VillePL' => $this->faker->randomElement($cities),
            'CodePostalPL' => $this->faker->optional()->postcode(),
            'PaysPL' => $countryCode,
            'NationalitePL' => $countryCode,
            'LieuNaissancePL' => $this->faker->randomElement($cities),
            'DateNaissancePL' => $this->faker->optional()->date(),
            'ObservationPL' => $this->faker->optional()->paragraph(),
            'ProfileFileNamePL' => null, // Default to null
            'remember_token' => Str::random(10),
        ];
    }

    /**
     * Indicate that the user is an administrator.
     */
    public function admin(): static
    {
        return $this->state(fn (array $attributes) => [
            'RoleUT' => 'admin', // Corrected: Set RoleUT to admin
            // Override email domain for admin
            'EmailUT' => "{$attributes['UserNameUT']}@ylschool.com",
        ]);
    }

    /**
     * Indicate that the user is a professor.
     */
    public function professeur(): static
    {
        return $this->state(fn (array $attributes) => [
            'RoleUT' => 'professeur', // Corrected: Set RoleUT to professeur
            // Override email domain for professeur
            'EmailUT' => "{$attributes['UserNameUT']}@ylschool-pr.com",
        ]);
    }

    /**
     * Indicate that the user is an etudiant.
     */
    public function etudiant(): static
    {
        return $this->state(fn (array $attributes) => [
            'RoleUT' => 'etudiant', // Corrected: Set RoleUT to etudiant
        ]);
    }
}
