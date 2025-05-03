<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Holiday;
use App\Models\AcademicYear;
use App\Models\SchoolCalendar;
use Carbon\CarbonPeriod;
use Illuminate\Support\Facades\DB;

class HolidaySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $currentYear = AcademicYear::where('IsCurrentYR', true)->first();

        if (!$currentYear) {
            $this->command->warn('Current AcademicYear not found. Skipping HolidaySeeder.');
            return;
        }

        // Define some common holidays (adjust dates as needed for the year)
        $holidaysData = [
            [
                'NameHD' => 'New Year Break',
                'StartDateHD' => $currentYear->StartDateYR->year . '-01-01',
                'EndDateHD' => $currentYear->StartDateYR->year . '-01-02',
                'DescriptionHD' => 'New Year Holiday'
            ],
            [
                'NameHD' => 'Spring Break',
                'StartDateHD' => $currentYear->EndDateYR->year . '-04-10',
                'EndDateHD' => $currentYear->EndDateYR->year . '-04-17',
                'DescriptionHD' => 'Spring Vacation'
            ],
            [
                'NameHD' => 'Summer Break',
                'StartDateHD' => $currentYear->EndDateYR->year . '-07-01',
                'EndDateHD' => $currentYear->EndDateYR->year . '-08-31',
                'DescriptionHD' => 'Summer Vacation'
            ],
            [
                'NameHD' => 'Winter Break',
                'StartDateHD' => $currentYear->StartDateYR->year . '-12-23',
                'EndDateHD' => ($currentYear->StartDateYR->year + 1) . '-01-03', // Spans year end
                'DescriptionHD' => 'Winter Vacation'
            ],
        ];

        foreach ($holidaysData as $data) {
            // Create the holiday record
            $holiday = Holiday::factory()
                        ->forYear($currentYear->MatriculeYR)
                        ->create($data);

            // Update SchoolCalendar entries for the holiday period
            $holidayPeriod = CarbonPeriod::create($holiday->StartDateHD, $holiday->EndDateHD);
            $datesToUpdate = [];
            foreach($holidayPeriod as $date) {
                $datesToUpdate[] = $date->format('Y-m-d');
            }

            if (!empty($datesToUpdate)) {
                SchoolCalendar::where('MatriculeYR', $currentYear->MatriculeYR)
                              ->whereIn('CalendarDateSC', $datesToUpdate)
                              ->update(['DayTypeSC' => 'Holiday']);
            }
        }

        $this->command->info('Created holidays and updated calendar for year: ' . $currentYear->NameYR);
    }
}
