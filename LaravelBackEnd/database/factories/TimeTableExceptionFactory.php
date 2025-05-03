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
            'ExceptionTypeTE' => $this->faker->randomElement(['Cancellation', 'Reschedule', 'Room Change']),
            'ExceptionDateTE' => $this->faker->dateTimeBetween('now', '+1 month')->format('Y-m-d'),
            'IsFulldayTE' => $this->faker->boolean(10), // 10% chance of being full day
            'MatriculeTS' => TimeSlot::factory(), // The original timeslot affected
            'ReasonTE' => $this->faker->optional()->sentence(),
            'NewMatriculeTS' => null, // Default to null (cancellation)
        ];
    }

    /**
     * Indicate the exception is a reschedule with a new timeslot.
     */
    public function reschedule(?string $newTimeSlotMatricule = null): static
    {
        return $this->state(fn (array $attributes) => [
            'ExceptionTypeTE' => 'Reschedule',
            // If no specific new slot is given, try to find another existing one or create one
            'NewMatriculeTS' => $newTimeSlotMatricule ?? TimeSlot::inRandomOrder()->first()?->MatriculeTS ?? TimeSlot::factory(),
        ]);
    }

    /**
     * Indicate the exception is for a specific timeslot.
     */
    public function forTimeSlot(string $timeSlotMatricule): static
    {
        return $this->state(fn (array $attributes) => [
            'MatriculeTS' => $timeSlotMatricule,
        ]);
    }
}
