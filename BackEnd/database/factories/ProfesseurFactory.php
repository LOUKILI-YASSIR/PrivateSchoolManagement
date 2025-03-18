<?php

namespace Database\Factories;

use App\Models\Professeur;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
class ProfesseurFactory extends Factory
{
    protected $model = Professeur::class;
    public function definition()
    {
        $country = $this->faker->countryCode; // Random 2-letter country code
        $admin1 = strtoupper($this->faker->lexify('??')); // Random 2-character code
        $admin2 = $this->faker->numerify('###'); // Random 3-digit code
        return [
            'matriculePr' => Str::random(),
            'image_urlPr' => $this->faker->imageUrl(),
            'civilitePr' => $this->faker->randomElement(['Mr', 'Mme', 'Dr']),
            'nomPr' => $this->faker->lastName(),
            'prenomPr' => $this->faker->firstName(),
            'nationalitePr' => $this->faker->country(),
            'CINPr' => $this->faker->unique()->numerify('#########'),
            'DateNaissancePr' => $this->faker->date(),
            'adressePr' => $this->faker->address(),
            'villePr' => "{$country}.{$admin1}.{$admin2}",
            'CodePostalPr' => $this->faker->numberBetween(1000, 99999),
            'paysPr' => $this->faker->country(),
            'emailPr' => $this->faker->unique()->safeEmail(),
            'Telephone1Pr' => $this->faker->phoneNumber(),
            'Telephone2Pr' => $this->faker->phoneNumber(),
            'dateEmbauchePr' => $this->faker->date(),
            'salairePr' => $this->faker->randomFloat(2, 0, 100000),
            'NomBanquePr' => $this->faker->company(),
            'RIBPr' => $this->faker->iban(),
            'observationPr' => $this->faker->text(),
        ];
    }
}
