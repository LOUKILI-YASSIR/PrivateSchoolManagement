<?php
namespace Database\Seeders;

use App\Models\Etudiant;
use Illuminate\Database\Seeder;

class EtudiantSeeder extends Seeder
{
    public function run(): void
    {
        Etudiant::factory()->count(100)->create();
    }
}
?>
