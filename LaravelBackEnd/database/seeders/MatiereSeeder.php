<?php

namespace Database\Seeders;

use App\Models\AcademicYear;
use App\Models\Matiere;
use App\Models\Niveau;
use Illuminate\Database\Seeder;

class MatiereSeeder extends Seeder
{
    public function run(): void
    {
        $year = AcademicYear::where('IsCurrentYR', true)->first();
        $niveaux = Niveau::all();

        if (!$year || $niveaux->isEmpty()) {
            $this->command?->warn('Current academic year or niveaux missing. Run AcademicYearSeeder and NiveauSeeder first.');
            return;
        }

        foreach ($niveaux as $niveau) {
            $existing = Matiere::where('MatriculeYR', $year->MatriculeYR)
                ->where('MatriculeNV', $niveau->MatriculeNV)
                ->count();

            for ($i = $existing; $i < 3; $i++) {
                Matiere::factory()->create([
                    'MatriculeYR' => $year->MatriculeYR,
                    'MatriculeNV' => $niveau->MatriculeNV,
                ]);
            }
        }
    }
}
