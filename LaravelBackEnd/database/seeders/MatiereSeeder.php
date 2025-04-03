<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Matiere;

class MatiereSeeder extends Seeder
{
    public function run()
    {
        $matieres = [
            [
                'matriculeMat' => 'MAT001',
                'matriculeSect' => 'SEC001',
                'nomMatiere' => 'Mathematics',
                'description' => 'Basic mathematics course',
            ],
            [
                'matriculeMat' => 'MAT002',
                'matriculeSect' => 'SEC001',
                'nomMatiere' => 'Physics',
                'description' => 'Basic physics course',
            ],
            [
                'matriculeMat' => 'MAT003',
                'matriculeSect' => 'SEC001',
                'nomMatiere' => 'Chemistry',
                'description' => 'Basic chemistry course',
            ],
            [
                'matriculeMat' => 'MAT004',
                'matriculeSect' => 'SEC001',
                'nomMatiere' => 'Biology',
                'description' => 'Basic biology course',
            ],
            [
                'matriculeMat' => 'MAT005',
                'matriculeSect' => 'SEC001',
                'nomMatiere' => 'English',
                'description' => 'English language course',
            ],
            [
                'matriculeMat' => 'MAT006',
                'matriculeSect' => 'SEC001',
                'nomMatiere' => 'French',
                'description' => 'French language course',
            ],
            [
                'matriculeMat' => 'MAT007',
                'matriculeSect' => 'SEC001',
                'nomMatiere' => 'History',
                'description' => 'World history course',
            ],
            [
                'matriculeMat' => 'MAT008',
                'matriculeSect' => 'SEC001',
                'nomMatiere' => 'Geography',
                'description' => 'World geography course',
            ]
        ];

        foreach ($matieres as $matiere) {
            Matiere::create($matiere);
        }
    }
} 