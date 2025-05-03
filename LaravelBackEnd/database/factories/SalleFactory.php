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
            // 'MatriculeSL' is handled by the GeneratesMatricule trait
            'NameSL' => 'Salle ' . $this->faker->unique()->word() . ' ' . $this->faker->randomNumber(2),
            'CapacitySL' => $this->faker->numberBetween(20, 100),
            'LocationSL' => $this->faker->optional()->word(), // e.g., Building A, Block C
            'RessourcesSL' => $this->faker->optional()->sentence(3),
            'TypeSL' => $this->faker->randomElement(['Classroom', 'Lab', 'Amphitheater', 'Meeting Room']),
            'StatusSL' => $this->faker->randomElement(['Available', 'Maintenance', 'Unavailable']),
            'FloorSL' => $this->faker->optional()->randomDigitNotNull(),
            'ObservationSL' => $this->faker->optional()->paragraph(),
        ];
    }
}
