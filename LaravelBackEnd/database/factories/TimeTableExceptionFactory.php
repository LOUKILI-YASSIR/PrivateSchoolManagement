<?php

namespace Database\Factories;

use App\Models\TimeTableException;
use App\Models\TimeSlot;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TimeTableException>
 */
class TimeTableExceptionFactory extends Factory
{
    protected $model = TimeTableException::class;
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            // 'matriculeTe' handled by trait
            'exceptionTypeTe' => $this->faker->randomElement(['Cancellation', 'Reschedule', 'Room Change']),
            'exceptionDateTe' => $this->faker->dateTimeBetween('now', '+1 month')->format('Y-m-d'),
            'isFulldayTe' => $this->faker->boolean(10), // 10% chance of being full day
            'matriculeTs' => TimeSlot::factory(), // The original timeslot affected
            'reasonTe' => $this->faker->optional()->sentence(),
            'newMatriculeTs' => null, // Default to null (cancellation)
        ];
    }

    /**
     * Indicate the exception is a reschedule with a new timeslot.
     */
    public function reschedule(?string $newTimeSlotMatricule = null): static
    {
        return $this->state(fn (array $attributes) => [
            'exceptionTypeTe' => 'Reschedule',
            // If no specific new slot is given, try to find another existing one or create one
            'newMatriculeTs' => $newTimeSlotMatricule ?? TimeSlot::inRandomOrder()->first()?->matriculeTs ?? TimeSlot::factory(),
        ]);
    }

    /**
     * Indicate the exception is for a specific timeslot.
     */
    public function forTimeSlot(string $timeSlotMatricule): static
    {
        return $this->state(fn (array $attributes) => [
            'matriculeTs' => $timeSlotMatricule,
        ]);
    }
}
