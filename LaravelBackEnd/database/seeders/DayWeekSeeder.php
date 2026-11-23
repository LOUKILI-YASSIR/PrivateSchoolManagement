<?php

namespace Database\Seeders;

use App\Models\DayWeek;
use Illuminate\Database\Seeder;

class DayWeekSeeder extends Seeder
{
    public function run(): void
    {
        foreach (['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as $day) {
            DayWeek::firstOrCreate(['DayNameDW' => $day]);
        }
    }
}
