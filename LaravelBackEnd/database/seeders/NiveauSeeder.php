<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Niveau; // Import Niveau model

class NiveauSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create 5 top-level Niveaux
        $parents = Niveau::factory(5)->create();

        // For each parent, create 2 child Niveaux
        foreach ($parents as $parent) {
            Niveau::factory(2)->childOf($parent->matriculeNv)->create([
                'typeNv' => $parent->typeNv, // Assign same type as parent for consistency
            ]);
        }

        // You could add more levels of nesting if needed
    }
}
