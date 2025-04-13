<?php

namespace Database\Factories;

use App\Models\Group;
use App\Models\Niveau;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Group>
 */
class GroupFactory extends Factory
{
    protected $model = Group::class;
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            // 'matriculeGp' handled by trait
            'NameGp' => 'Group ' . $this->faker->randomLetter() . $this->faker->randomNumber(1),
            'descriptionGp' => $this->faker->optional()->sentence(),
            'statusGp' => $this->faker->randomElement(['Active', 'Archived', 'Planned']),
            // Foreign key will be set in the seeder or using a state
            'matriculeNv' => Niveau::factory(), // Default: create a new Niveau if not specified
        ];
    }

    /**
     * Assign a specific Niveau.
     */
    public function forNiveau(string $niveauMatricule): static
    {
        return $this->state(fn (array $attributes) => [
            'matriculeNv' => $niveauMatricule,
        ]);
    }
}
