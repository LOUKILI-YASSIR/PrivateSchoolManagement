<?php
namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create admin user
        User::factory()->admin()->create([
            'email' => 'admin@ylschool.ma',
            'nomUsers' => 'Admin',
            'prenom' => 'System',
            'role' => 'admin'
        ]);

        // Create professor users
        User::factory()->count(5)->professeur()->create();

        // Create student users
        User::factory()->count(10)->etudiant()->create();
    }
}
?>
