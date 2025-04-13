<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\SpecialDaySchedule;
use App\Models\TimeSlot;

class SpecialDayScheduleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $timeSlots = TimeSlot::all();

        // Create 3 full-day events
        SpecialDaySchedule::factory(3)->fullDay()->create();

        // Create 5 events tied to specific timeslots
        if (!$timeSlots->isEmpty()) {
            for ($i = 0; $i < 5; $i++) {
                SpecialDaySchedule::factory()
                    ->forTimeSlot($timeSlots->random()->matriculeTs)
                    ->create();
            }
        } else {
            $this->command->warn('No TimeSlots found. Skipping timeslot-specific SpecialDaySchedule creation.');
        }
    }
}
