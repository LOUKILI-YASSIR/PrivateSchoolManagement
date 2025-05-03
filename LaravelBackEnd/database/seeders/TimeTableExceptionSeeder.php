<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\TimeTableException;
use App\Models\TimeSlot;

class TimeTableExceptionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $timeSlots = TimeSlot::all();

        if ($timeSlots->isEmpty()) {
            $this->command->warn('No TimeSlots found. Skipping TimeTableExceptionSeeder. Please run TimeSlotSeeder first.');
            return;
        }

        // Create 5 cancellation exceptions for random timeslots
        for ($i = 0; $i < 5; $i++) {
            TimeTableException::factory()
                ->forTimeSlot($timeSlots->random()->MatriculeTS)
                ->create(['ExceptionTypeTE' => 'Cancellation', 'NewMatriculeTS' => null]);
        }

        // Create 3 reschedule exceptions for random timeslots
        $availableSlots = $timeSlots->pluck('MatriculeTS');
        for ($i = 0; $i < 3; $i++) {
            $originalSlot = $timeSlots->random();
            // Find a different slot for rescheduling
            $newSlotMatricule = $availableSlots->whereNotIn('MatriculeTS', [$originalSlot->MatriculeTS])->random();

            TimeTableException::factory()
                ->forTimeSlot($originalSlot->MatriculeTS)
                ->reschedule($newSlotMatricule)
                ->create();
        }
    }
}
