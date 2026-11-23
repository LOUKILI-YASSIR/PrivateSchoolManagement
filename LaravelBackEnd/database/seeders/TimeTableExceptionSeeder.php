<?php

namespace Database\Seeders;

use App\Models\AcademicYear;
use App\Models\TimeSlot;
use App\Models\TimeTableException;
use Illuminate\Database\Seeder;

class TimeTableExceptionSeeder extends Seeder
{
    public function run(): void
    {
        if (TimeTableException::query()->exists()) {
            $this->command?->warn('Timetable exceptions already exist. Skipping to avoid duplicates.');
            return;
        }

        $year = AcademicYear::where('IsCurrentYR', true)->first();
        $timeSlots = TimeSlot::all();

        if (!$year || $timeSlots->count() < 2) {
            $this->command?->warn('A current academic year and at least two time slots are required.');
            return;
        }

        for ($i = 0; $i < min(5, $timeSlots->count()); $i++) {
            $slot = $timeSlots[$i];
            TimeTableException::factory()->forTimeSlot($slot->MatriculeTS)->create([
                'MatriculeYR' => $year->MatriculeYR,
                'ExceptionTypeTE' => 'Cancellation',
                'IsFulldayTE' => false,
                'NewMatriculeTS' => null,
            ]);
        }

        for ($i = 0; $i < min(3, $timeSlots->count()); $i++) {
            $original = $timeSlots[$i];
            $replacement = $timeSlots
                ->first(fn ($slot) => $slot->MatriculeTS !== $original->MatriculeTS);

            if (!$replacement) {
                continue;
            }

            TimeTableException::factory()
                ->forTimeSlot($original->MatriculeTS)
                ->reschedule($replacement->MatriculeTS)
                ->create([
                    'MatriculeYR' => $year->MatriculeYR,
                    'IsFulldayTE' => false,
                ]);
        }
    }
}
