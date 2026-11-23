<?php

namespace Database\Seeders;

use App\Models\AcademicYear;
use App\Models\Professeur;
use App\Models\User;
use Illuminate\Database\Seeder;

class ProfesseurSeeder extends Seeder
{
    public function run(): void
    {
        $year = AcademicYear::where('IsCurrentYR', true)->first();
        $users = User::where('RoleUT', 'professeur')->get();

        if (!$year || $users->isEmpty()) {
            $this->command?->warn('Current academic year or professeur users missing. Run UserSeeder and AcademicYearSeeder first.');
            return;
        }

        foreach ($users as $user) {
            if (Professeur::where('MatriculeUT', $user->MatriculeUT)->exists()) {
                continue;
            }

            // Explicitly override factory relations to prevent creating
            // unrelated User, AcademicYear, or Matiere records.
            Professeur::factory()->create([
                'MatriculeYR' => $year->MatriculeYR,
                'MatriculeUT' => $user->MatriculeUT,
                'MatriculeMT' => null,
            ]);
        }
    }
}
