<?php

namespace Database\Seeders;

use App\Models\Professeur;
use App\Models\TeacherVocation;
use Illuminate\Database\Seeder;

class TeacherVocationSeeder extends Seeder
{
    public function run(): void
    {
        $professeurs = Professeur::all();

        if ($professeurs->isEmpty()) {
            $this->command?->warn('No professors found. Run ProfesseurSeeder first.');
            return;
        }

        foreach ($professeurs as $professeur) {
            if (TeacherVocation::where('MatriculePR', $professeur->MatriculePR)->exists()) {
                continue;
            }

            $count = random_int(1, 2);
            TeacherVocation::factory()->count($count)
                ->forProfesseur($professeur->MatriculePR)
                ->create(['MatriculeYR' => $professeur->MatriculeYR]);
        }
    }
}
