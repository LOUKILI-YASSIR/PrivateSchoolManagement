<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Group;
use App\Models\Niveau;

class GroupSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $niveaux = Niveau::all();

        if ($niveaux->isEmpty()) {
            $this->command->warn('No niveaux found. Skipping GroupSeeder. Please run NiveauSeeder first.');
            return;
        }

        // Create 2 Groups for each Niveau
        foreach ($niveaux as $niveau) {
            Group::factory(2)->forNiveau($niveau->matriculeNv)->create();
        }
    }
}
