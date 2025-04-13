<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\TimeSlot; // Import TimeSlot model

class TimeSlotSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $slots = [
            ['startTimeTs' => '08:00:00', 'endTimeTs' => '09:00:00'],
            ['startTimeTs' => '09:00:00', 'endTimeTs' => '10:00:00'],
            ['startTimeTs' => '10:00:00', 'endTimeTs' => '11:00:00'],
            ['startTimeTs' => '11:00:00', 'endTimeTs' => '12:00:00'],
            // Lunch break - could be represented differently if needed
            ['startTimeTs' => '13:00:00', 'endTimeTs' => '14:00:00'],
            ['startTimeTs' => '14:00:00', 'endTimeTs' => '15:00:00'],
            ['startTimeTs' => '15:00:00', 'endTimeTs' => '16:00:00'],
            ['startTimeTs' => '16:00:00', 'endTimeTs' => '17:00:00'],
        ];

        foreach ($slots as $slot) {
            TimeSlot::create($slot); // Use create to leverage GeneratesMatricule
        }
    }
}
