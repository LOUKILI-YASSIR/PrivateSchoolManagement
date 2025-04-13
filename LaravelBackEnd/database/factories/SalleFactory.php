<?php

namespace Database\Factories;

use App\Models\Salle;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Salle>
 */
class SalleFactory extends Factory
{
    protected $model = Salle::class;
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            // 'matriculeSl' is handled by the GeneratesMatricule trait
            'NameSl' => 'Salle ' . $this->faker->unique()->word() . ' ' . $this->faker->randomNumber(2),
            'CapacitySl' => $this->faker->numberBetween(20, 100),
            'LocationSl' => $this->faker->optional()->word(), // e.g., Building A, Block C
            'ressourcesSl' => $this->faker->optional()->sentence(3),
            'typeSl' => $this->faker->randomElement(['Classroom', 'Lab', 'Amphitheater', 'Meeting Room']),
            'statusSl' => $this->faker->randomElement(['Available', 'Maintenance', 'Unavailable']),
            'floorSl' => $this->faker->optional()->randomDigitNotNull(),
            'observationSl' => $this->faker->optional()->paragraph(),
        ];
    }
}
