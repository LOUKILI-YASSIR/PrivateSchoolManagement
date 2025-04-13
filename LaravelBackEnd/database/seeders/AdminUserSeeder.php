<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'matriculeUt' => 'UT' . str_pad(1, 6, '0', STR_PAD_LEFT),
            'usernameUt' => 'admin',
            'emailUt' => 'admin@ylschool.ma',
            'passwordUt' => Hash::make('YlSchool@2025'),
            'roleUt' => 'admin',
            'statutUt' => 'offline',
            'NomPl' => 'Admin',
            'prenomPl' => 'User',
        ]);
    }
} 