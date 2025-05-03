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
        $startYear = $this->faker->numberBetween(2020, Carbon::now()->year);
        $startDate = Carbon::createFromDate($startYear, 9, 1); // Sept 1st
        $endDate = $startDate->copy()->addYear()->subDay(); // End of Aug next year

        return [
            // 'MatriculeYR' handled by trait
            'StatusYR' => 'Planned',
            'NameYR' => $startYear . '-' . ($startYear + 1),
            'DescriptionYR' => $this->faker->optional()->sentence(),
            'StartDateYR' => $startDate->format('Y-m-d'),
            'EndDateYR' => $endDate->format('Y-m-d'),
            'ArchivedDateYR' => null,
            'IsCurrentYR' => false,
            'MatriculeUT' => User::factory()->admin(), // Default to creating an admin user
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
