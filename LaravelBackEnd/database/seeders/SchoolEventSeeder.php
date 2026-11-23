<?php

namespace Database\Seeders;

use App\Models\AcademicYear;
use App\Models\SchoolEvent;
use App\Models\TimeSlot;
use Illuminate\Database\Seeder;

class SchoolEventSeeder extends Seeder
{
    public function run(): void
    {
        if (SchoolEvent::query()->exists()) {
            $this->command?->warn('School events already exist. Skipping to avoid duplicates.');
            return;
        }

        $year = AcademicYear::where('IsCurrentYR', true)->first();

        if (!$year) {
            $this->command?->warn('Current academic year not found. Run AcademicYearSeeder first.');
            return;
        }

        SchoolEvent::factory()->count(5)->fullDay()->create([
            'MatriculeYR' => $year->MatriculeYR,
        ]);

        $timeSlots = TimeSlot::all();
        if ($timeSlots->isEmpty()) {
            $this->command?->warn('No time slots found. Only full-day events were created.');
            return;
        }

        for ($i = 0; $i < 10; $i++) {
            SchoolEvent::factory()
                ->forTimeSlot($timeSlots->random()->MatriculeTS)
                ->create(['MatriculeYR' => $year->MatriculeYR]);
        }
    }
}
