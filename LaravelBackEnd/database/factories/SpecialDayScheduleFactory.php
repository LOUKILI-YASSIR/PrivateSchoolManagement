<?php

namespace Database\Factories;

use App\Models\SpecialDaySchedule;
use App\Models\TimeSlot;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\SpecialDaySchedule>
 */
class SpecialDayScheduleFactory extends Factory
{
    protected $model = SpecialDaySchedule::class;
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            // 'MatriculeSS' handled by trait
            'DateSS' => $this->faker->dateTimeBetween('+1 day', '+2 months')->format('Y-m-d'),
            'IsFulldaySS' => $this->faker->boolean(20), // 20% chance of full day event
            'MatriculeTS' => TimeSlot::factory(), // Specific timeslot for the activity
            'LocationSS' => $this->faker->optional()->company() . ' Hall',
            'ActivityNameSS' => $this->faker->catchPhrase(),
        ];
    }

    /**
     * Indicate the schedule is for a specific timeslot.
     */
    public function forTimeSlot(string $timeSlotMatricule): static
    {
        return $this->state(fn (array $attributes) => [
            'MatriculeTS' => $timeSlotMatricule,
            'IsFulldaySS' => false, // Cannot be full day if tied to specific slot
        ]);
    }

    /**
     * Indicate the schedule is for a full day.
     */
    public function fullDay(): static
    {
        return $this->state(fn (array $attributes) => [
            'IsFulldaySS' => true,
            'MatriculeTS' => null, // No specific timeslot for full day
        ]);
    }
}
