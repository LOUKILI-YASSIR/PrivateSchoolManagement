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
            // 'matriculeHd' handled by trait
            'startdateHd' => $startDate->format('Y-m-d'),
            'endDateHd' => $endDate->format('Y-m-d'),
            'nameHd' => $this->faker->words(3, true) . ' Holiday',
            'descriptionHd' => $this->faker->optional()->sentence(),
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
