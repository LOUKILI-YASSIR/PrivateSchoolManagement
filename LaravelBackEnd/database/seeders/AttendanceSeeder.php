<?php

namespace Database\Seeders;

use App\Models\Attendance;
use App\Models\Etudiant;
use App\Models\Professeur;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class AttendanceSeeder extends Seeder
{
    public function run(): void
    {
        $startDate = Carbon::now()->subMonth()->startOfDay();
        $endDate = Carbon::now()->startOfDay();
        $etudiants = Etudiant::all();
        $professeurs = Professeur::all();

        if ($etudiants->isEmpty() && $professeurs->isEmpty()) {
            $this->command?->warn('No students or professors found. Skipping AttendanceSeeder.');
            return;
        }

        foreach ($etudiants as $etudiant) {
            for ($date = $startDate->copy(); $date->lte($endDate); $date->addDay()) {
                if (!$date->isWeekday() || random_int(1, 10) > 8) {
                    continue;
                }

                $exists = Attendance::where('MatriculeET', $etudiant->MatriculeET)
                    ->whereDate('DateAT', $date->toDateString())
                    ->exists();

                if (!$exists) {
                    Attendance::factory()->forEtudiant($etudiant->MatriculeET)->create([
                        'MatriculeYR' => $etudiant->MatriculeYR,
                        'DateAT' => $date->toDateString(),
                    ]);
                }
            }
        }

        foreach ($professeurs as $professeur) {
            for ($date = $startDate->copy(); $date->lte($endDate); $date->addDay()) {
                if (!$date->isWeekday() || random_int(1, 10) > 9) {
                    continue;
                }

                $exists = Attendance::where('MatriculePR', $professeur->MatriculePR)
                    ->whereDate('DateAT', $date->toDateString())
                    ->exists();

                if (!$exists) {
                    Attendance::factory()->forProfesseur($professeur->MatriculePR)->create([
                        'MatriculeYR' => $professeur->MatriculeYR,
                        'DateAT' => $date->toDateString(),
                    ]);
                }
            }
        }
    }
}
