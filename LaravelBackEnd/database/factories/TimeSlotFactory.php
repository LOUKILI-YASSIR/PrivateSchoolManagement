<?php

namespace Database\Factories;

use App\Models\TimeSlot;
use Illuminate\Database\Eloquent\Factories\Factory;
use Carbon\Carbon;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TimeSlot>
 */
class TimeSlotFactory extends Factory
{
    protected $model = TimeSlot::class;
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Create a random start time on the hour between 8 AM and 4 PM
        $startHour = $this->faker->numberBetween(8, 16);
        $startTime = Carbon::createFromTime($startHour, 0, 0);
        // End time is typically 1 hour later
        $endTime = $startTime->copy()->addHour();

        return [
            // 'matriculeTs' handled by trait
            'startTimeTs' => $startTime->format('H:i:s'),
            'endTimeTs' => $endTime->format('H:i:s'),
        ];
    }
}
