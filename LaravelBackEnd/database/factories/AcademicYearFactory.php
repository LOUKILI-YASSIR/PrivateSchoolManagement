<?php

namespace Database\Factories;

use App\Models\AcademicYear;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Carbon\Carbon;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\AcademicYear>
 */
class AcademicYearFactory extends Factory
{
    protected $model = AcademicYear::class;
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            // 'MatriculeYR' handled by trait
            'StatusYR' => $this->faker->randomElement(['Active', 'Archived', 'Planned']),
            'NameYR' => $this->faker->year() . '-' . ($this->faker->year() + 1),
            'DescriptionYR' => $this->faker->optional()->sentence(),
            'StartDateYR' => $this->faker->dateTimeBetween('-1 year', 'now'),
            'EndDateYR' => $this->faker->dateTimeBetween('now', '+1 year'),
            'ArchivedDateYR' => $this->faker->optional()->dateTimeBetween('now', '+2 years'),
            'IsCurrentYR' => $this->faker->boolean(20),
            'MatriculeUT' => User::factory(),
        ];
    }

    /**
     * Mark the academic year as current.
     */
    public function current(): static
    {
        return $this->state(fn (array $attributes) => [
            'IsCurrentYR' => true,
            'StatusYR' => 'Active',
        ]);
    }

    /**
     * Assign a specific admin user.
     */
    public function createdBy(string $userMatricule): static
    {
        return $this->state(fn (array $attributes) => [
            'MatriculeUT' => $userMatricule,
        ]);
    }
}
