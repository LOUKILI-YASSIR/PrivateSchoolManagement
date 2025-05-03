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
            ['StartTimeTS' => '08:00:00', 'EndTimeTS' => '09:00:00'],
            ['StartTimeTS' => '09:00:00', 'EndTimeTS' => '10:00:00'],
            ['StartTimeTS' => '10:00:00', 'EndTimeTS' => '11:00:00'],
            ['StartTimeTS' => '11:00:00', 'EndTimeTS' => '12:00:00'],
            // Lunch break - could be represented differently if needed
            ['StartTimeTS' => '13:00:00', 'EndTimeTS' => '14:00:00'],
            ['StartTimeTS' => '14:00:00', 'EndTimeTS' => '15:00:00'],
            ['StartTimeTS' => '15:00:00', 'EndTimeTS' => '16:00:00'],
            ['StartTimeTS' => '16:00:00', 'EndTimeTS' => '17:00:00'],
        ];

        foreach ($slots as $slot) {
            TimeSlot::create($slot); // Use create to leverage GeneratesMatricule
        }
    }
}
