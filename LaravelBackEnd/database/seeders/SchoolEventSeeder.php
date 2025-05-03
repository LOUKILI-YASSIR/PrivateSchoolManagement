<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\SchoolEvent;
use App\Models\TimeSlot;

class SchoolEventSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $timeSlots = TimeSlot::all();

        // Create 5 full-day school events
        SchoolEvent::factory(5)->fullDay()->create();

        // Create 10 events tied to specific timeslots
        if (!$timeSlots->isEmpty()) {
            for ($i = 0; $i < 10; $i++) {
                SchoolEvent::factory()
                    ->forTimeSlot($timeSlots->random()->MatriculeTS)
                    ->create();
            }
        } else {
            $this->command->warn('No TimeSlots found. Skipping timeslot-specific SchoolEvent creation.');
        }
    }
}
