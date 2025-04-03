<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\DB;

class UserFactory extends Factory
{
    protected $model = User::class;

    // Prefixes des rôles
    private const ROLE_PREFIXES = [
        'admin' => 'AD',
        'etudiant' => 'ET',
        'professeur' => 'PR',
    ];

    public function definition(): array
    {
        // Par défaut, génère un étudiant ou professeur (sans admin)
        return $this->buildUserAttributes(
            $this->faker->randomElement(['etudiant', 'professeur'])
        );
    }

    public function admin()
    {
        return $this->state(fn (array $attributes) =>
            $this->buildUserAttributes('admin')
        );
    }

    public function etudiant()
    {
        return $this->state(fn (array $attributes) =>
            $this->buildUserAttributes('etudiant')
        );
    }

    public function professeur()
    {
        return $this->state(fn (array $attributes) =>
            $this->buildUserAttributes('professeur')
        );
    }

    private function buildUserAttributes(string $role): array
    {
        $currentYear = now()->year;
        $prefix = self::ROLE_PREFIXES[$role];
        $microtime = microtime(true);
        $counter = substr(str_replace('.', '', $microtime), -6);

        $nom = $this->faker->lastName;
        $prenom = $this->faker->firstName;

        // Génération des valeurs uniques
        $email = strtolower(sprintf("%s.%s.%06d@ylschool.ma",
            $this->sanitizeString($prenom),
            $this->sanitizeString($nom),
            $counter
        ));

        return [
            'matricule' => sprintf("YLSCHOOL_UT_%s_%s_%06d", $prefix, $currentYear, $counter),
            'nomUsers' => $nom,
            'email' => $email,
            'role' => $role,
            'password' => bcrypt('YLSchool@2025'),
            'prenom' => $prenom,
            'date_naissance' => $this->faker->dateTimeBetween('-30 years', '-18 years')->format('Y-m-d'),
            'sexe' => $this->faker->randomElement(['M', 'F']),
            'nationalite' => $this->faker->country,
            'lieu_naissance' => $this->faker->city,
            'adresse' => $this->faker->address,
            'code_postal' => $this->faker->numberBetween(10000, 99999),
            'ville' => $this->faker->city,
            'pays' => $this->faker->country,
            'telephone_mobile' => $this->faker->phoneNumber,
            'actif' => true,
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
