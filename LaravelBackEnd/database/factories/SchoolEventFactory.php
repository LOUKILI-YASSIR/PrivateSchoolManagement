<?php

namespace Database\Factories;

use App\Models\SchoolEvent;
use App\Models\TimeSlot;
use App\Models\AcademicYear;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\SchoolEvent>
 */
class SchoolEventFactory extends Factory
{
    protected $model = SchoolEvent::class;
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'MatriculeYR' => AcademicYear::factory(),
            // 'MatriculeSE' handled by trait
            'NameSE' => $this->faker->words(4, true),
            'DescriptionSE' => $this->faker->sentence(),
            'IsFulldaySE' => $this->faker->boolean(25),
            'LocationSE' => $this->faker->optional()->address(),
            'DateSE' => $this->faker->dateTimeBetween('now', '+3 months')->format('Y-m-d'),
            'MatriculeTS' => null, // Default to null (can be set if not full day)
        ];
    }

    /**
     * Indicate the event is for a specific timeslot.
     */
    public function forTimeSlot(string $timeSlotMatricule): static
    {
        return $this->state(fn (array $attributes) => [
            'MatriculeTS' => $timeSlotMatricule,
            'IsFulldaySE' => false,
        ]);
    }

     /**
     * Indicate the event is for a full day.
     */
    public function fullDay(): static
    {
        return $this->state(fn (array $attributes) => [
            'IsFulldaySE' => true,
            'MatriculeTS' => null,
        ]);
    }
}
