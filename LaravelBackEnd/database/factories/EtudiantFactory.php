<?php

namespace Database\Factories;

use App\Models\Etudiant;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Etudiant>
 */
class EtudiantFactory extends Factory
{
    protected $model = Etudiant::class;

    public function definition()
    {
        // Generate a new matriculeEt based on Professeur logic
        $generatedMatriculeEt = "YLSCHOOL_Et_" . date("Y") . "_" . str_pad(mt_rand(1, 100), 5, "0", STR_PAD_LEFT);

        $country = $this->faker->countryCode; // Random 2-letter country code
        $admin1 = strtoupper($this->faker->lexify('??')); // Random 2-character code
        $admin2 = $this->faker->numerify('###'); // Random 3-digit code
        return [
            // Student Information
            'matriculeEt' => $generatedMatriculeEt,
            'GENREEt' => $this->faker->randomElement(['H', 'F']),
            'NOMEt' => $this->faker->lastName,
            'PRENOMEt' => $this->faker->firstName,
            'LIEU_NAISSANCEEt' => $this->faker->city,
            'DATE_NAISSANCEEt' => $this->faker->date('Y-m-d', '2010-01-01'),
            'NATIONALITEEt' => $this->faker->country(),
            'ADRESSEEt' => $this->faker->address,
            'VILLEEt' => $this->faker->city,
            'PAYSEt' => $this->faker->country(),
            'CODE_POSTALEt' => $this->faker->numberBetween(1000, 99999),
            'EMAILEt' => $this->faker->unique()->safeEmail,
            'PROFILE_PICTUREEt' => "/uploads/default.jpg",
            'OBSERVATIONEt' => $this->faker->paragraph,

            // Parent Information
            'LIEN_PARENTETr' => $this->faker->randomElement([
                'Père', 'Mère', 'Frère', 'Sœur', 'Oncle', 'Tante',
                'Grand-père', 'Grand-mère', 'Tuteur'
            ]),
            'NOMTr' => $this->faker->lastName,
            'PRENOMTr' => $this->faker->firstName,
            'PROFESSIONTr' => $this->faker->jobTitle,
            'TELEPHONE1Tr' => $this->faker->phoneNumber,
            'TELEPHONE2Tr' => $this->faker->phoneNumber,
            'EMAILTr' => $this->faker->unique()->safeEmail,
            'OBSERVATIONTr' => $this->faker->paragraph,

            // Timestamps
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
