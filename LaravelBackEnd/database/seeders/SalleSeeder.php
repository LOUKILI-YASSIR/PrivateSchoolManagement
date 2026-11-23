<?php

namespace Database\Seeders;

use App\Models\AcademicYear;
use App\Models\Salle;
use Illuminate\Database\Seeder;

class SalleSeeder extends Seeder
{
    public function run(): void
    {
        if (Salle::query()->exists()) {
            $this->command?->warn('Salles already exist. Skipping SalleSeeder to avoid duplicates.');
            return;
        }

        $year = AcademicYear::where('IsCurrentYR', true)->first();

        if (!$year) {
            $this->command?->warn('Current academic year not found. Run AcademicYearSeeder first.');
            return;
        }

        Salle::factory()->count(15)->create([
            'MatriculeYR' => $year->MatriculeYR,
        ]);
    }
}
