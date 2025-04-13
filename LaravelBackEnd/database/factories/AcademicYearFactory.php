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
            // 'matriculeYR' handled by trait
            'statusYR' => 'Planned',
            'NameYR' => $startYear . '-' . ($startYear + 1),
            'descriptionYR' => $this->faker->optional()->sentence(),
            'startDateYR' => $startDate->format('Y-m-d'),
            'endDateYR' => $endDate->format('Y-m-d'),
            'ArchivedDateYR' => null,
            'isCurrentYR' => false,
            'matriculeUt' => User::factory()->admin(), // Default to creating an admin user
        ];
    }

    /**
     * Mark the academic year as current.
     */
    public function current(): static
    {
        return $this->state(fn (array $attributes) => [
            'isCurrentYR' => true,
            'statusYR' => 'Active',
        ]);
    }

    /**
     * Assign a specific admin user.
     */
    public function createdBy(string $userMatricule): static
    {
        return $this->state(fn (array $attributes) => [
            'matriculeUt' => $userMatricule,
        ]);
    }
}
