<?php

namespace Database\Seeders;

use App\Models\Group;
use App\Models\Professeur;
use Illuminate\Database\Seeder;

class GroupsProfesseursSeeder extends Seeder
{
    public function run(): void
    {
        $groups = Group::all();
        $professeurs = Professeur::all();

        if ($groups->isEmpty() || $professeurs->isEmpty()) {
            $this->command?->warn('Groups or professeurs missing. Run GroupSeeder and ProfesseurSeeder first.');
            return;
        }

        foreach ($groups as $group) {
            $selected = $professeurs->shuffle()->take(min(2, $professeurs->count()));
            // The pivot primary key is an auto-incrementing MatriculePG.
            $group->professeurs()->syncWithoutDetaching($selected->modelKeys());
        }
    }
}
