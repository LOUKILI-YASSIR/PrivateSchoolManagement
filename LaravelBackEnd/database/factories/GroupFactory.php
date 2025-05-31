<?php

namespace Database\Factories;

use App\Models\Group;
use App\Models\Niveau;
use App\Models\AcademicYear;
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
            // 'MatriculeGP' handled by trait
            'MatriculeYR' => AcademicYear::factory(),
            'NameGP' => $this->faker->words(2, true),
            'DescriptionGP' => $this->faker->optional()->sentence(),
            'MatriculeNV' => Niveau::factory(),
        ];
    }

    /**
     * Assign a specific Niveau.
     */
    public function forNiveau(string $niveauMatricule): static
    {
        return $this->state(fn (array $attributes) => [
            'MatriculeNV' => $niveauMatricule,
        ]);
    }
}
