<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run()
    {
        User::create([
            'matriculeUt' => 'YLSCHOOL_' . date('Y') . '_UT_AD_00001',
            'nomUsers' => 'Admin',
            'email' => 'admin@school.com',
            'phone_number' => '+1234567890',
            'matricule' => 'ADMIN001',
            'role' => 'admin',
            'password' => Hash::make('admin123'),
            'prenom' => 'System',
            'date_naissance' => '1990-01-01',
            'sexe' => 'M',
            'nationalite' => 'Moroccan',
            'lieu_naissance' => 'Casablanca',
            'adresse' => '123 Admin Street',
            'code_postal' => '20000',
            'ville' => 'Casablanca',
            'pays' => 'Morocco',
            'telephone_fixe' => '+212-123-456-789',
            'telephone_mobile' => '+212-123-456-789',
            'contact_urgence_nom' => 'Emergency Contact',
            'contact_urgence_telephone' => '+212-123-456-790',
            'contact_urgence_relation' => 'Family',
            'actif' => true
        ]);
    }
} 