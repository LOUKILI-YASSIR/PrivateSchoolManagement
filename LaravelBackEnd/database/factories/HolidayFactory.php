<?php

namespace Database\Factories;

use App\Models\Holiday;
use App\Models\AcademicYear;
use Illuminate\Database\Eloquent\Factories\Factory;
use Carbon\Carbon;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Holiday>
 */
class HolidayFactory extends Factory
{
    protected $model = Holiday::class;
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $startDate = $this->faker->dateTimeBetween('-6 months', '+6 months');
        $duration = $this->faker->numberBetween(1, 14); // Holiday duration 1-14 days
        $endDate = Carbon::instance($startDate)->addDays($duration -1);

        return [
            // 'MatriculeHD' handled by trait
            'StartDateHD' => $startDate->format('Y-m-d'),
            'EndDateHD' => $endDate->format('Y-m-d'),
            'NameHD' => $this->faker->words(3, true) . ' Holiday',
            'DescriptionHD' => $this->faker->optional()->sentence(),
            'MatriculeYR' => AcademicYear::factory(),
        ];
    }

    /**
     * Assign a specific AcademicYear.
     */
    public function forYear(string $yearMatricule): static
    {
        return $this->state(fn (array $attributes) => [
            'MatriculeYR' => $yearMatricule,
        ]);
    }
}
