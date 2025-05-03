<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Faker\Factory as Faker;
use Illuminate\Support\Facades\Crypt;
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
        $plainCode = Str::random(27);
        $encryptedCode = Crypt::encryptString($plainCode);
        // Create admin user
        User::create([
            'MatriculeUT' => 'YLSCHOOL_2024_ADM_00001',
            'UserNameUT' => 'admin_' . Str::random(4),
            'EmailUT' => 'yassirloukili60@gmail.com',
            'PasswordUT' => Hash::make('YLSchool@2025'),
            'RoleUT' => 'admin',
            'CodeVerificationUT' =>  $encryptedCode,
            'StatutUT' => 'active',
            'GenrePL' => $faker->randomElement(['Homme', 'Femelle']),
            'NomPL' => $faker->lastName,
            'PrenomPL' => $faker->firstName,
            'AdressPL' => $faker->streetAddress,
            'VillePL' => 'Casablanca',
            'CodePostalPL' => $faker->postcode,
            'PaysPL' => 'MA',
            'NationalitePL' => 'MA',
            'DateNaissancePL' => $faker->date('Y-m-d', '-20 years'),
            'LieuNaissancePL' => $faker->city,
            'PhoneUT' => "+212675648482",
            'ProfileFileNamePL' => null,
            'ObservationPL' => null,
        ]);

        // Create 20 random users
        for ($i = 0; $i < 20; $i++) {
            // Randomly select a country and its city
            $countryCode = $faker->randomElement(array_keys($countries));
            $cities = $countries[$countryCode];
            $plainCode = Str::random(27);
            $encryptedCode = Crypt::encryptString($plainCode);


            User::create([
                'MatriculeUT' => 'YLSCHOOL_2024_UT_' . str_pad($i + 1, 5, '0', STR_PAD_LEFT),
                'UserNameUT' => $faker->unique()->userName . '_' . Str::random(4),
                'EmailUT' => $faker->unique()->safeEmail,
                'PasswordUT' => Hash::make('YLSchool@2025'),
                'CodeVerificationUT' =>  $encryptedCode,
                'RoleUT' => $faker->randomElement(['etudiant', 'professeur']),
                'StatutUT' => $faker->randomElement(['offline', 'online']),
                'GenrePL' => $faker->randomElement(['Homme', 'Femelle']),
                'NomPL' => $faker->lastName,
                'PrenomPL' => $faker->firstName,
                'AdressPL' => $faker->streetAddress,
                'VillePL' => $faker->randomElement($cities),
                'CodePostalPL' => $faker->postcode,
                'PaysPL' => $countryCode,
                'NationalitePL' => $countryCode,
                'DateNaissancePL' => $faker->date('Y-m-d', '-20 years'),
                'LieuNaissancePL' => $faker->city,
                'PhoneUT' => $faker->phoneNumber,
                'ProfileFileNamePL' => null,
                'ObservationPL' => null,
            ]);
        }
    }
}
