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
        $currentYear = AcademicYear::where('isCurrentYR', true)->first();

        if (!$currentYear) {
            $this->command->warn('Current AcademicYear not found. Skipping HolidaySeeder.');
            return;
        }

        // Define some common holidays (adjust dates as needed for the year)
        $holidaysData = [
            [
                'nameHd' => 'New Year Break',
                'startdateHd' => $currentYear->startDateYR->year . '-01-01',
                'endDateHd' => $currentYear->startDateYR->year . '-01-02',
                'descriptionHd' => 'New Year Holiday'
            ],
            [
                'nameHd' => 'Spring Break',
                'startdateHd' => $currentYear->endDateYR->year . '-04-10',
                'endDateHd' => $currentYear->endDateYR->year . '-04-17',
                'descriptionHd' => 'Spring Vacation'
            ],
            [
                'nameHd' => 'Summer Break',
                'startdateHd' => $currentYear->endDateYR->year . '-07-01',
                'endDateHd' => $currentYear->endDateYR->year . '-08-31',
                'descriptionHd' => 'Summer Vacation'
            ],
            [
                'nameHd' => 'Winter Break',
                'startdateHd' => $currentYear->startDateYR->year . '-12-23',
                'endDateHd' => ($currentYear->startDateYR->year + 1) . '-01-03', // Spans year end
                'descriptionHd' => 'Winter Vacation'
            ],
        ];

        foreach ($holidaysData as $data) {
            // Create the holiday record
            $holiday = Holiday::factory()
                        ->forYear($currentYear->matriculeYR)
                        ->create($data);

            // Update SchoolCalendar entries for the holiday period
            $holidayPeriod = CarbonPeriod::create($holiday->startdateHd, $holiday->endDateHd);
            $datesToUpdate = [];
            foreach($holidayPeriod as $date) {
                $datesToUpdate[] = $date->format('Y-m-d');
            }

            if (!empty($datesToUpdate)) {
                SchoolCalendar::where('matriculeYR', $currentYear->matriculeYR)
                              ->whereIn('calendarDateSc', $datesToUpdate)
                              ->update(['dayTypeSc' => 'Holiday']);
            }
        }

        $this->command->info('Created holidays and updated calendar for year: ' . $currentYear->NameYR);
    }
}
