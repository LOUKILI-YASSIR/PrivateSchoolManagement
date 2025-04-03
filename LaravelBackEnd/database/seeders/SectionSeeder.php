<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Section;

class SectionSeeder extends Seeder
{
    public function run()
    {
        $sections = [
            [
                'matriculeSect' => 'SEC001',
                'nomSect' => 'General Sciences',
                'matriculeAnnee' => '2024-2025',
            ],
            [
                'matriculeSect' => 'SEC002',
                'nomSect' => 'Humanities',
                'matriculeAnnee' => '2024-2025',
            ],
            [
                'matriculeSect' => 'SEC003',
                'nomSect' => 'Technical',
                'matriculeAnnee' => '2024-2025',
            ]
        ];

        foreach ($sections as $section) {
            Section::create($section);
        }
    }
} 