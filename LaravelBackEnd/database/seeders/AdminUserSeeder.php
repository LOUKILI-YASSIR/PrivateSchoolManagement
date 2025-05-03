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
            'MatriculeUT' => 'UT' . str_pad(1, 6, '0', STR_PAD_LEFT),
            'UserNameUT' => 'admin',
            'EmailUT' => 'admin@ylschool.ma',
            'PasswordUT' => Hash::make('YlSchool@2025'),
            'RoleUT' => 'admin',
            'StatutUT' => 'offline',
            'NomPL' => 'Admin',
            'PrenomPL' => 'User',
        ]);
    }
} 