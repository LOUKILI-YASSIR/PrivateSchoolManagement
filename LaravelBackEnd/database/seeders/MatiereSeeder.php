<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Matiere;
use App\Models\Niveau;
use App\Models\Professeur;

class MatiereSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $niveaux = Niveau::all();
        $professeurs = Professeur::all();

        if ($niveaux->isEmpty() || $professeurs->isEmpty()) {
            $this->command->warn('Niveaux or Professeurs not found. Skipping MatiereSeeder. Please run NiveauSeeder and ProfesseurSeeder first.');
            return;
        }

        // Create 3 Matieres for each Niveau, assigning a random Professeur
        foreach ($niveaux as $niveau) {
            for ($i = 0; $i < 3; $i++) {
                Matiere::factory()
                    ->forNiveau($niveau->MatriculeNV)
                    ->forProfesseur($professeurs->random()->MatriculePR)
                    ->create();
            }
        }
    }
}
