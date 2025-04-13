<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Attendance;
use App\Models\Etudiant;
use App\Models\Professeur;
use Carbon\Carbon;

class AttendanceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $etudiants = Etudiant::all();
        $professeurs = Professeur::all();
        $startDate = Carbon::now()->subMonth(); // Record attendance for the last month
        $endDate = Carbon::now();

        if ($etudiants->isEmpty() && $professeurs->isEmpty()) {
             $this->command->warn('No Etudiants or Professeurs found. Skipping AttendanceSeeder.');
            return;
        }

        // Create some attendance records for Etudiants
        foreach ($etudiants as $etudiant) {
            for ($date = $startDate->copy(); $date->lte($endDate); $date->addDay()) {
                 // Only record on weekdays, and skip ~20% of days
                if ($date->isWeekday() && rand(1, 10) <= 8) {
                    // Check if record exists
                     if (!Attendance::where('matriculeEt', $etudiant->matriculeEt)->whereDate('DateAt', $date)->exists()) {
                        Attendance::factory()->forEtudiant($etudiant->matriculeEt)->create([
                            'DateAt' => $date->format('Y-m-d'),
                        ]);
                    }
                }
            }
        }

        // Create some attendance records for Professeurs
         foreach ($professeurs as $professeur) {
            for ($date = $startDate->copy(); $date->lte($endDate); $date->addDay()) {
                // Only record on weekdays, and skip ~10% of days
                if ($date->isWeekday() && rand(1, 10) <= 9) {
                    // Check if record exists
                    if (!Attendance::where('matriculePr', $professeur->matriculePr)->whereDate('DateAt', $date)->exists()) {
                        Attendance::factory()->forProfesseur($professeur->matriculePr)->create([
                            'DateAt' => $date->format('Y-m-d'),
                        ]);
                    }
                }
            }
        }
    }
}
