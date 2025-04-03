<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Niveau;

class NiveauSeeder extends Seeder
{
    public function run()
    {
        $niveaux = [
            [
                'matriculeNiv' => 'NIV001',
                'description' => 'Première année du cycle primaire',
                'libelle' => 'CP1',
                'order' => 1
            ],
            [
                'matriculeNiv' => 'NIV002',
                'description' => 'Deuxième année du cycle primaire',
                'libelle' => 'CP2',
                'order' => 2
            ],
            [
                'matriculeNiv' => 'NIV003',
                'description' => 'Troisième année du cycle primaire',
                'libelle' => 'CE1',
                'order' => 3
            ],
            [
                'matriculeNiv' => 'NIV004',
                'description' => 'Quatrième année du cycle primaire',
                'libelle' => 'CE2',
                'order' => 4
            ],
            [
                'matriculeNiv' => 'NIV005',
                'description' => 'Cinquième année du cycle primaire',
                'libelle' => 'CM1',
                'order' => 5
            ],
            [
                'matriculeNiv' => 'NIV006',
                'description' => 'Sixième année du cycle primaire',
                'libelle' => 'CM2',
                'order' => 6
            ]
        ];

        foreach ($niveaux as $niveau) {
            Niveau::create($niveau);
        }
    }
} 