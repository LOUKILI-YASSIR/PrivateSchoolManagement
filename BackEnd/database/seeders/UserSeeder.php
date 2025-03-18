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
        // Créer 10 étudiants
        User::factory()->count(400)->etudiant()->create();

        // Créer 5 professeurs
        User::factory()->count(40)->professeur()->create();

        // Créer 1 admin
        User::factory()->admin()->create();
    }
}
?>
