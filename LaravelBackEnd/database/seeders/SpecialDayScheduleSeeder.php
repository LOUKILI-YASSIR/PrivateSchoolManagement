<?php

namespace Database\Seeders;

use App\Models\AcademicYear;
use App\Models\SpecialDaySchedule;
use App\Models\TimeSlot;
use Illuminate\Database\Seeder;

class SpecialDayScheduleSeeder extends Seeder
{
    public function run(): void
    {
        if (SpecialDaySchedule::query()->exists()) {
            $this->command?->warn('Special-day schedules already exist. Skipping to avoid duplicates.');
            return;
        }

        $year = AcademicYear::where('IsCurrentYR', true)->first();

        if (!$year) {
            $this->command?->warn('Current academic year not found. Run AcademicYearSeeder first.');
            return;
        }

        SpecialDaySchedule::factory()->count(3)->fullDay()->create([
            'MatriculeYR' => $year->MatriculeYR,
        ]);

        $timeSlots = TimeSlot::all();
        if ($timeSlots->isEmpty()) {
            $this->command?->warn('No time slots found. Only full-day schedules were created.');
            return;
        }

        for ($i = 0; $i < 5; $i++) {
            SpecialDaySchedule::factory()
                ->forTimeSlot($timeSlots->random()->MatriculeTS)
                ->create(['MatriculeYR' => $year->MatriculeYR]);
        }
    }
}
