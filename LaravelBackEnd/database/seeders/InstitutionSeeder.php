<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Institution;

class InstitutionSeeder extends Seeder
{
    public function run()
    {
        $institutions = [
            [
                'matriculeInst' => 'INST001',
                'nomInst' => 'Your School Name',
                'dateDebut' => '2024-01-01',
                'dateFin' => '2025-12-31'
            ]
        ];

        foreach ($institutions as $institution) {
            Institution::create($institution);
        }
    }
} 