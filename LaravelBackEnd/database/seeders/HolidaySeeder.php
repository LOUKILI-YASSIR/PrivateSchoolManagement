<?php

namespace Database\Seeders;

use App\Models\AcademicYear;
use App\Models\Holiday;
use App\Models\SchoolCalendar;
use Carbon\Carbon;
use Carbon\CarbonPeriod;
use Illuminate\Database\Seeder;

class HolidaySeeder extends Seeder
{
    public function run(): void
    {
        $year = AcademicYear::where('IsCurrentYR', true)->first();

        if (!$year) {
            $this->command?->warn('Current academic year not found. Run AcademicYearSeeder first.');
            return;
        }

        $startYear = $year->StartDateYR->year;
        $endYear = $year->EndDateYR->year;

        $holidays = [
            ['New Year Break', Carbon::create($endYear, 1, 1), Carbon::create($endYear, 1, 2), 'New Year Holiday'],
            ['Spring Break', Carbon::create($endYear, 4, 10), Carbon::create($endYear, 4, 17), 'Spring Vacation'],
            ['Summer Break', Carbon::create($endYear, 7, 1), Carbon::create($endYear, 8, 31), 'Summer Vacation'],
            ['Winter Break', Carbon::create($startYear, 12, 23), Carbon::create($endYear, 1, 3), 'Winter Vacation'],
        ];

        foreach ($holidays as [$name, $start, $end, $description]) {
            $holiday = Holiday::firstOrCreate(
                ['MatriculeYR' => $year->MatriculeYR, 'NameHD' => $name],
                [
                    'StartDateHD' => $start->toDateString(),
                    'EndDateHD' => $end->toDateString(),
                    'DescriptionHD' => $description,
                ]
            );

            foreach (CarbonPeriod::create($holiday->StartDateHD, $holiday->EndDateHD) as $date) {
                SchoolCalendar::where('MatriculeYR', $year->MatriculeYR)
                    ->whereDate('CalendarDateSC', $date->toDateString())
                    ->update(['DayTypeSC' => 'Holiday']);
            }
        }

        $this->command?->info('Holiday records are ready for ' . $year->NameYR . '.');
    }
}
