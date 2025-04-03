<?php

namespace Database\Factories;

use App\Models\Etudiant;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Etudiant>
 */
class EtudiantFactory extends Factory
{
    protected $model = Etudiant::class;
    private static $counter = 1;

    public function definition()
    {
        // Generate a unique matriculeEt using a counter
        $matricule = "YLSCHOOL_ET_" . date("Y") . "_" . str_pad(self::$counter++, 6, "0", STR_PAD_LEFT);
        $nom = $this->faker->lastName;
        $prenom = $this->faker->firstName;
        $email = strtolower(sprintf("%s.%s.%06d@ylschool.ma", 
            $this->sanitizeString($prenom),
            $this->sanitizeString($nom),
            self::$counter
        ));

        // Create the corresponding user
        $user = User::create([
            'matricule' => $matricule,
            'nomUsers' => $nom,
            'prenom' => $prenom,
            'email' => $email,
            'role' => 'etudiant',
            'password' => bcrypt('password'),
            'date_naissance' => $this->faker->dateTimeBetween('-20 years', '-15 years')->format('Y-m-d'),
            'sexe' => $this->faker->randomElement(['M', 'F']),
            'nationalite' => $this->faker->country,
            'lieu_naissance' => $this->faker->city,
            'adresse' => $this->faker->address,
            'code_postal' => $this->faker->postcode,
            'ville' => $this->faker->city,
            'pays' => $this->faker->country,
            'telephone_mobile' => $this->faker->phoneNumber,
            'actif' => true,
        ]);

        return [
            'matriculeEt' => $matricule,
            'GENREEt' => $user->sexe === 'M' ? 'Homme' : 'Femme',
            'NOMEt' => $nom,
            'PRENOMEt' => $prenom,
            'LIEU_NAISSANCEEt' => $user->lieu_naissance,
            'DATE_NAISSANCEEt' => $user->date_naissance,
            'NATIONALITEEt' => $user->nationalite,
            'ADRESSEEt' => $user->adresse,
            'VILLEEt' => $user->ville,
            'PAYSEt' => $user->pays,
            'CODE_POSTALEt' => $this->faker->numberBetween(10000, 99999),
            'EMAILEt' => $user->email,
            'PROFILE_PICTUREEt' => "/uploads/default.jpg",
            'OBSERVATIONEt' => $this->faker->paragraph,
            'user_id' => $user->id,

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

    private function sanitizeString($string): string
    {
        $string = iconv('UTF-8', 'ASCII//TRANSLIT', $string);
        $string = strtolower($string);
        $string = preg_replace('/[^a-z0-9.]/', '', $string);
        return $string;
    }
}
