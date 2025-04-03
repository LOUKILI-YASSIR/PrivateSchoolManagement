<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Professeur;
use Illuminate\Support\Str;

class ProfesseurSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $professeurs = [
            [
                'matriculePr' => 'YOx882XvnjKHPxbV',
                'matriculeMat' => 'MAT001',
                'image_urlPr' => 'https://via.placeholder.com/640x480.png/005555?text=illo',
                'civilitePr' => 'Dr',
                'nomPr' => 'Donnelly',
                'prenomPr' => 'Dexter',
                'nationalitePr' => 'Liberia',
                'CINPr' => '534103868',
                'DateNaissancePr' => '2003-11-17',
                'adressePr' => '54685 Buford Plaza Apt. 137',
                'villePr' => 'Maciville',
                'CodePostalPr' => '19040',
                'paysPr' => 'Zambia',
                'emailPr' => 'norbert.shields@example.org',
                'Telephone1Pr' => '929-952-3034',
                'Telephone2Pr' => '(743) 756-9596',
                'dateEmbauchePr' => '2020-05-11',
                'salairePr' => 1150.06,
                'NomBanquePr' => 'Moore-Hammes',
                'RIBPr' => 'RS69137571849437878877',
                'observationPr' => 'Nemo quis delectus mollitia ullam doloribus. Ut dolor veritatis nulla qui neque voluptate repudiandae. Occaecati voluptatibus nisi aspernatur ducimus aliquid.',
            ],
            [
                'matriculePr' => 'KJp123XvnjKHPxbW',
                'matriculeMat' => 'MAT002',
                'image_urlPr' => 'https://via.placeholder.com/640x480.png/005555?text=illo',
                'civilitePr' => 'Mr',
                'nomPr' => 'Smith',
                'prenomPr' => 'John',
                'nationalitePr' => 'Morocco',
                'CINPr' => '123456789',
                'DateNaissancePr' => '1980-01-01',
                'adressePr' => '123 Main Street',
                'villePr' => 'Casablanca',
                'CodePostalPr' => '20000',
                'paysPr' => 'Morocco',
                'emailPr' => 'john.smith@example.com',
                'Telephone1Pr' => '+212-123-456-789',
                'Telephone2Pr' => '+212-123-456-790',
                'dateEmbauchePr' => '2020-01-01',
                'salairePr' => 5000.00,
                'NomBanquePr' => 'Attijariwafa Bank',
                'RIBPr' => 'MA123456789012345678901234',
                'observationPr' => 'Experienced teacher with 10 years of experience.',
            ],
        ];

        foreach ($professeurs as $professeur) {
            Professeur::create($professeur);
        }
    }
}
