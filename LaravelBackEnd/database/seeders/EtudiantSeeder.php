<?php

namespace Database\Seeders;

use App\Models\AcademicYear;
use App\Models\Etudiant;
use App\Models\Group;
use App\Models\Niveau;
use App\Models\User;
use Illuminate\Database\Seeder;

class EtudiantSeeder extends Seeder
{
    public function run(): void
    {
        $year = AcademicYear::where('IsCurrentYR', true)->first();
        $niveaux = Niveau::all();
        $users = User::where('RoleUT', 'etudiant')->get();

        if (!$year || $niveaux->isEmpty() || $users->isEmpty()) {
            $this->command?->warn('Academic year, niveaux, or student users missing. Run UserSeeder, AcademicYearSeeder, and NiveauSeeder first.');
            return;
        }

        foreach ($users as $user) {
            if (Etudiant::where('MatriculeUT', $user->MatriculeUT)->exists()) {
                continue;
            }

            $niveau = $niveaux->random();
            $group = Group::where('MatriculeNV', $niveau->MatriculeNV)->inRandomOrder()->first();

            // Override factory relations so no extra users, years, or niveaux
            // are silently generated.
            Etudiant::factory()->create([
                'MatriculeYR' => $year->MatriculeYR,
                'MatriculeUT' => $user->MatriculeUT,
                'MatriculeNV' => $niveau->MatriculeNV,
                'MatriculeGP' => $group?->MatriculeGP,
            ]);
        }
    }
}
