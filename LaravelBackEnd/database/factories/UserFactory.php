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

        // Trouver le compteur maximal existant pour ce rôle/année
        $maxCounter = User::where('matriculeUt', 'LIKE', "YLSCHOOL_UT_{$prefix}_{$currentYear}_%")
            ->max(DB::raw('CAST(SUBSTRING(matriculeUt, -6) AS UNSIGNED)'));

        $counter = ($maxCounter ?? 0) + 1;

        // Génération des valeurs uniques
        return [
            'matriculeUt' => sprintf("YLSCHOOL_UT_%s_%s_%06d", $prefix, $currentYear, $counter),
            'nomUt' => sprintf("%s%06d@ylschool.ma", strtolower($role), $counter),
            'roleUt' => $role,
            'passwordUt' => bcrypt('password'),
        ];
    }
}
