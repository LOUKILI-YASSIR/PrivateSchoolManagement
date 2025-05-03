<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\SchoolCalendar;
use App\Models\AcademicYear;
use Carbon\Carbon;
use Carbon\CarbonPeriod;

class SchoolCalendarSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $currentYear = AcademicYear::where('IsCurrentYR', true)->first();

        if (!$currentYear) {
            $this->command->warn('Current AcademicYear not found. Skipping SchoolCalendarSeeder.');
            return;
        }

        // Generate calendar entries for the current academic year
        $period = CarbonPeriod::create($currentYear->StartDateYR, $currentYear->EndDateYR);

        $calendarEntries = [];
        foreach ($period as $date) {
            $dayType = $date->isWeekend() ? 'Weekend' : 'School Day'; // Simple weekend check
            $calendarEntries[] = [
                // 'MatriculeSC' handled by trait via create()
                'CalendarDateSC' => $date->format('Y-m-d'),
                'DayTypeSC' => $dayType,
                'MatriculeYR' => $currentYear->MatriculeYR,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        // Bulk insert for efficiency
        // Need to generate matricules manually or insert one by one if trait relies on creating event

        // Insert one by one to use the trait
        foreach ($calendarEntries as $entry) {
             // Check if entry already exists for this date and year
            if (!SchoolCalendar::where('CalendarDateSC', $entry['CalendarDateSC'])->where('MatriculeYR', $entry['MatriculeYR'])->exists()) {
                SchoolCalendar::create($entry);
            }
        }

        $this->command->info('Generated school calendar for year: ' . $currentYear->NameYR);
    }
}
