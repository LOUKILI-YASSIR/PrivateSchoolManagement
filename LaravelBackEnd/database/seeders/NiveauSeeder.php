<?php

namespace Database\Seeders;

use App\Models\AcademicYear;
use App\Models\Niveau;
use Illuminate\Database\Seeder;

class NiveauSeeder extends Seeder
{
    public function run(): void
    {
        if (Niveau::query()->exists()) {
            $this->command?->warn('Niveaux already exist. Skipping NiveauSeeder to avoid duplicates.');
            return;
        }

        $year = AcademicYear::where('IsCurrentYR', true)->first();

        if (!$year) {
            $this->command?->warn('Current academic year not found. Run AcademicYearSeeder first.');
            return;
        }

        // The current niveaux migration requires MatriculeYR and does not
        // contain the legacy SubMatriculeNV or TypeNV columns.
        for ($i = 1; $i <= 15; $i++) {
            Niveau::create([
                'CodeNV' => 'NIV-' . $year->StartDateYR->year . '-' . str_pad((string) $i, 3, '0', STR_PAD_LEFT),
                'NomNV' => 'Niveau ' . $i,
                'DescriptionNV' => 'Données de démonstration',
                'MatriculeYR' => $year->MatriculeYR,
            ]);
        }
    }
}
