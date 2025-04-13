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
            // 'matriculeSS' handled by trait
            'dateSS' => $this->faker->dateTimeBetween('+1 day', '+2 months')->format('Y-m-d'),
            'isFulldaySS' => $this->faker->boolean(20), // 20% chance of full day event
            'matriculeTs' => TimeSlot::factory(), // Specific timeslot for the activity
            'locationSS' => $this->faker->optional()->company() . ' Hall',
            'activityNameSS' => $this->faker->catchPhrase(),
        ];
    }

    /**
     * Indicate the schedule is for a specific timeslot.
     */
    public function forTimeSlot(string $timeSlotMatricule): static
    {
        return $this->state(fn (array $attributes) => [
            'matriculeTs' => $timeSlotMatricule,
            'isFulldaySS' => false, // Cannot be full day if tied to specific slot
        ]);
    }

    /**
     * Indicate the schedule is for a full day.
     */
    public function fullDay(): static
    {
        return $this->state(fn (array $attributes) => [
            'isFulldaySS' => true,
            'matriculeTs' => null, // No specific timeslot for full day
        ]);
    }
}
