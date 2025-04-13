<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\DayWeek; // Import DayWeek model

class DayWeekSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $days = [
            ['dayNameDW' => 'Monday'],
            ['dayNameDW' => 'Tuesday'],
            ['dayNameDW' => 'Wednesday'],
            ['dayNameDW' => 'Thursday'],
            ['dayNameDW' => 'Friday'],
            ['dayNameDW' => 'Saturday'],
            ['dayNameDW' => 'Sunday'],
        ];

        foreach ($days as $day) {
            DayWeek::create($day); // Use create to leverage GeneratesMatricule
        }
    }
}
