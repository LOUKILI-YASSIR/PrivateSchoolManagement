<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\TeacherVocation;
use App\Models\Professeur;

class TeacherVocationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $professeurs = Professeur::all();

        if ($professeurs->isEmpty()) {
            $this->command->warn('No Professeurs found. Skipping TeacherVocationSeeder.');
            return;
        }

        // Create 1 or 2 vocation records for each professeur
        foreach ($professeurs as $professeur) {
            $numberOfVocations = rand(1, 2);
            TeacherVocation::factory($numberOfVocations)
                ->forProfesseur($professeur->MatriculePR)
                ->create();
        }
    }
}
