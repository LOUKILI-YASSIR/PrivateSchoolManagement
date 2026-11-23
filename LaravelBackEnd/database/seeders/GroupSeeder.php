<?php

namespace Database\Seeders;

use App\Models\AcademicYear;
use App\Models\Group;
use App\Models\Niveau;
use Illuminate\Database\Seeder;

class GroupSeeder extends Seeder
{
    public function run(): void
    {
        if (Group::query()->exists()) {
            $this->command?->warn('Groups already exist. Skipping GroupSeeder to avoid duplicates.');
            return;
        }

        $year = AcademicYear::where('IsCurrentYR', true)->first();
        $niveaux = Niveau::all();

        if (!$year || $niveaux->isEmpty()) {
            $this->command?->warn('Current academic year or niveaux missing. Run AcademicYearSeeder and NiveauSeeder first.');
            return;
        }

        foreach ($niveaux as $niveau) {
            Group::factory()->count(2)
                ->forNiveau($niveau->MatriculeNV)
                ->create(['MatriculeYR' => $year->MatriculeYR]);
        }
    }
}
