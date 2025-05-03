<?php

namespace Database\Factories;

use App\Models\Niveau;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Niveau>
 */
class NiveauFactory extends Factory
{
    protected $model = Niveau::class;
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            // 'MatriculeNV' is handled by the GeneratesMatricule trait
            'CodeNV' => $this->faker->bothify('NIV-??##'),
            'NomNV' => $this->faker->word() . ' ' . $this->faker->randomDigitNotNull(),
            'SubMatriculeNV' => null, // Default to null, set in seeder if needed
            'TypeNV' => $this->faker->randomElement(['Primary', 'Secondary', 'Higher Education', 'Department']),
            'DescriptionNV' => $this->faker->optional()->sentence(),
            'StatusNV' => $this->faker->randomElement(['Active', 'Inactive', 'Planned']),
        ];
    }

    /**
     * Indicate that the niveau is a child of another niveau.
     *
     * @param string $parentMatricule
     * @return static
     */
    public function childOf(string $parentMatricule): static
    {
        return $this->state(fn (array $attributes) => [
            'SubMatriculeNV' => $parentMatricule,
        ]);
    }
}
