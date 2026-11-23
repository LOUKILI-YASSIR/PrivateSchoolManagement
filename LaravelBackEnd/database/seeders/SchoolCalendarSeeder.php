<?php

namespace Database\Seeders;

use App\Models\AcademicYear;
use App\Models\SchoolCalendar;
use Carbon\CarbonPeriod;
use Illuminate\Database\Seeder;

class SchoolCalendarSeeder extends Seeder
{
    public function run(): void
    {
        $year = AcademicYear::where('IsCurrentYR', true)->first();

        if (!$year) {
            $this->command?->warn('Current academic year not found. Run AcademicYearSeeder first.');
            return;
        }

        $period = CarbonPeriod::create($year->StartDateYR, $year->EndDateYR);

        foreach ($period as $date) {
            SchoolCalendar::firstOrCreate(
                [
                    'MatriculeYR' => $year->MatriculeYR,
                    'CalendarDateSC' => $date->toDateString(),
                ],
                [
                    'DayTypeSC' => $date->isWeekend() ? 'Weekend' : 'School Day',
                ]
            );
        }

        $this->command?->info('School calendar is ready for ' . $year->NameYR . '.');
    }
}
