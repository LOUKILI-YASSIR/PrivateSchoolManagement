<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\AnneeAcademique;

class AnneeAcademiqueSeeder extends Seeder
{
    public function run()
    {
        $annees = [
            [
                'matriculeAnnee' => '2024-2025',
                'matriculeInst' => 'INST001', // We need to create institutions first
                'dateDebut' => '2024-09-01',
                'dateFin' => '2025-06-30',
                'estActive' => true,
                'annee' => '2024-2025'
            ],
            [
                'matriculeAnnee' => '2023-2024',
                'matriculeInst' => 'INST001',
                'dateDebut' => '2023-09-01',
                'dateFin' => '2024-06-30',
                'estActive' => false,
                'annee' => '2023-2024'
            ]
        ];

        foreach ($annees as $annee) {
            AnneeAcademique::create($annee);
        }
    }
} 