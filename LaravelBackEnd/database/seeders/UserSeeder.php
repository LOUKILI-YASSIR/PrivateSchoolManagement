<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Faker\Factory as Faker;
use Illuminate\Support\Str;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create();

        // Define country codes and their major cities
        $countries = [
            'MA' => ['Casablanca', 'Rabat', 'Fes', 'Marrakech', 'Tanger'],
            'FR' => ['Paris', 'Lyon', 'Marseille', 'Bordeaux', 'Nice'],
            'US' => ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Miami'],
            'GB' => ['London', 'Manchester', 'Birmingham', 'Liverpool', 'Edinburgh'],
            'ES' => ['Madrid', 'Barcelona', 'Valencia', 'Seville', 'Bilbao'],
        ];

        // Create admin user
        User::create([
            'matriculeUt' => 'YLSCHOOL_2024_ADM_00001',
            'usernameUt' => 'admin_' . Str::random(4),
            'emailUt' => 'admin@ylschool.com',
            'passwordUt' => Hash::make('YlSchool@2025'),
            'roleUt' => 'admin',
            'statutUt' => 'active',
            'genrePl' => $faker->randomElement(['Homme', 'Femelle']),
            'NomPl' => $faker->lastName,
            'PrenomPl' => $faker->firstName,
            'adressPl' => $faker->streetAddress,
            'villePl' => 'Casablanca',
            'codePostalPl' => $faker->postcode,
            'paysPl' => 'MA',
            'nationalitePl' => 'MA',
            'dateNaissancePl' => $faker->date('Y-m-d', '-20 years'),
            'lieuNaissancePl' => $faker->city,
            'phoneUt' => $faker->phoneNumber,
            'profileFileNamePl' => null,
            'ObservationPl' => null,
        ]);

        // Create 20 random users
        for ($i = 0; $i < 20; $i++) {
            // Randomly select a country and its city
            $countryCode = $faker->randomElement(array_keys($countries));
            $cities = $countries[$countryCode];

            User::create([
                'matriculeUt' => 'YLSCHOOL_2024_UT_' . str_pad($i + 1, 5, '0', STR_PAD_LEFT),
                'usernameUt' => $faker->unique()->userName . '_' . Str::random(4),
                'emailUt' => $faker->unique()->safeEmail,
                'passwordUt' => Hash::make('password123'),
                'roleUt' => $faker->randomElement(['etudiant', 'professeur']),
                'statutUt' => $faker->randomElement(['offline', 'online']),
                'genrePl' => $faker->randomElement(['Homme', 'Femelle']),
                'NomPl' => $faker->lastName,
                'PrenomPl' => $faker->firstName,
                'adressPl' => $faker->streetAddress,
                'villePl' => $faker->randomElement($cities),
                'codePostalPl' => $faker->postcode,
                'paysPl' => $countryCode,
                'nationalitePl' => $countryCode,
                'dateNaissancePl' => $faker->date('Y-m-d', '-20 years'),
                'lieuNaissancePl' => $faker->city,
                'phoneUt' => $faker->phoneNumber,
                'profileFileNamePl' => null,
                'ObservationPl' => null,
            ]);
        }
    }
}
