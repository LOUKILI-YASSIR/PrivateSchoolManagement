<?php

namespace Database\Factories;

use App\Models\SchoolEvent;
use App\Models\TimeSlot;
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
            // 'matriculeSe' handled by trait
            'nameSe' => $this->faker->words(4, true),
            'descriptionSe' => $this->faker->sentence(),
            'isFulldaySe' => $this->faker->boolean(25),
            'locationSe' => $this->faker->optional()->address(),
            'dateSe' => $this->faker->dateTimeBetween('now', '+3 months')->format('Y-m-d'),
            'matriculeTs' => null, // Default to null (can be set if not full day)
        ];
    }

    /**
     * Indicate the event is for a specific timeslot.
     */
    public function forTimeSlot(string $timeSlotMatricule): static
    {
        return $this->state(fn (array $attributes) => [
            'matriculeTs' => $timeSlotMatricule,
            'isFulldaySe' => false,
        ]);
    }

     /**
     * Indicate the event is for a full day.
     */
    public function fullDay(): static
    {
        return $this->state(fn (array $attributes) => [
            'isFulldaySe' => true,
            'matriculeTs' => null,
        ]);
    }
}
