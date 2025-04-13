<?php

namespace Database\Factories;

use App\Models\SchoolCalendar;
use App\Models\AcademicYear;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\SchoolCalendar>
 */
class SchoolCalendarFactory extends Factory
{
    protected $model = SchoolCalendar::class;
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            // 'matriculeSc' handled by trait
            'calendarDateSc' => $this->faker->date(),
            'dayTypeSc' => 'School Day', // Default type
            'matriculeYR' => AcademicYear::factory(),
        ];
    }

    /**
     * Assign a specific AcademicYear.
     */
    public function forYear(string $yearMatricule): static
    {
        return $this->state(fn (array $attributes) => [
            'matriculeYR' => $yearMatricule,
        ]);
    }
}
