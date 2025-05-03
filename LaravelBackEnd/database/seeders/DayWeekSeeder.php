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
            ['DayNameDW' => 'Monday'],
            ['DayNameDW' => 'Tuesday'],
            ['DayNameDW' => 'Wednesday'],
            ['DayNameDW' => 'Thursday'],
            ['DayNameDW' => 'Friday'],
            ['DayNameDW' => 'Saturday'],
            ['DayNameDW' => 'Sunday'],
        ];

        foreach ($days as $day) {
            DayWeek::create($day); // Use create to leverage GeneratesMatricule
        }
    }
}
