<?php

namespace Database\Factories;

use App\Models\Etudiant;
use App\Models\User;
use App\Models\AcademicYear;
use App\Models\Group;
use App\Models\Niveau;
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
        return [
            // 'MatriculeET' handled by trait
            'MatriculeYR' => AcademicYear::factory(),
            'EmailET' => $this->faker->unique()->safeEmail(),
            'PhoneET' => $this->faker->phoneNumber(),
            'LienParenteTR' => $this->faker->randomElement(['Father', 'Mother', 'Guardian']),
            'ProfessionTR' => $this->faker->jobTitle(),
            'NomTR' => $this->faker->lastName(),
            'PrenomTR' => $this->faker->firstName(),
            'Phone1TR' => $this->faker->phoneNumber(),
            'Phone2TR' => $this->faker->optional()->phoneNumber(),
            'EmailTR' => $this->faker->unique()->safeEmail(),
            'ObservationTR' => $this->faker->optional()->sentence(),
            'MatriculeUT' => User::factory(),
            'MatriculeGP' => null,
            'MatriculeNV' => Niveau::factory(),
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
            'MatriculeGP' => $groupMatricule,
        ]);
    }

    /**
     * Assign a specific niveau to the student.
     *
     * @param string $niveauMatricule
     * @return static
     */
    public function forNiveau(string $niveauMatricule): static
    {
        return $this->state(fn (array $attributes) => [
            'MatriculeNV' => $niveauMatricule,
        ]);
    }
}
