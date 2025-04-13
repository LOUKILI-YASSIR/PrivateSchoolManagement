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
            // 'matriculeNv' is handled by the GeneratesMatricule trait
            'codeNv' => $this->faker->bothify('NIV-??##'),
            'NomNv' => $this->faker->word() . ' ' . $this->faker->randomDigitNotNull(),
            'parent_matriculeNv' => null, // Default to null, set in seeder if needed
            'typeNv' => $this->faker->randomElement(['Primary', 'Secondary', 'Higher Education', 'Department']),
            'descriptionNv' => $this->faker->optional()->sentence(),
            'statusNv' => $this->faker->randomElement(['Active', 'Inactive', 'Planned']),
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
            'parent_matriculeNv' => $parentMatricule,
        ]);
    }
}
