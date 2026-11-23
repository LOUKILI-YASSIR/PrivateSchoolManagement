<?php

namespace Database\Seeders;

use App\Models\AcademicYear;
use App\Models\DayWeek;
use App\Models\Group;
use App\Models\Matiere;
use App\Models\Professeur;
use App\Models\RegularTimeTable;
use App\Models\Salle;
use App\Models\TimeSlot;
use Illuminate\Database\Seeder;

class RegularTimeTableSeeder extends Seeder
{
    public function run(): void
    {
        if (RegularTimeTable::query()->exists()) {
            $this->command?->warn('Regular timetable entries already exist. Skipping to avoid duplicates.');
            return;
        }

        $year = AcademicYear::where('IsCurrentYR', true)->first();
        $days = DayWeek::whereNotIn('DayNameDW', ['Saturday', 'Sunday'])->get();
        $timeSlots = TimeSlot::all();
        $groups = Group::all();
        $professeurs = Professeur::all();
        $salles = Salle::all();

        if (!$year || $days->isEmpty() || $timeSlots->isEmpty() || $groups->isEmpty()
            || $professeurs->isEmpty() || $salles->isEmpty()) {
            $this->command?->warn('Missing timetable prerequisites. Run the base seeders first.');
            return;
        }

        $assigned = ['group' => [], 'professeur' => [], 'salle' => []];

        foreach ($groups as $group) {
            $matieres = Matiere::where('MatriculeNV', $group->MatriculeNV)
                ->where('MatriculeYR', $year->MatriculeYR)
                ->get();

            if ($matieres->isEmpty()) {
                continue;
            }

            foreach ($days as $day) {
                foreach ($timeSlots as $slot) {
                    if (random_int(1, 10) > 3) {
                        continue;
                    }

                    $professeur = $professeurs->random();
                    $salle = $salles->random();
                    $slotKey = $day->MatriculeDW . '|' . $slot->MatriculeTS;

                    if (isset($assigned['group'][$slotKey . '|' . $group->MatriculeGP])
                        || isset($assigned['professeur'][$slotKey . '|' . $professeur->MatriculePR])
                        || isset($assigned['salle'][$slotKey . '|' . $salle->MatriculeSL])) {
                        continue;
                    }

                    RegularTimeTable::factory()->create([
                        'MatriculeYR' => $year->MatriculeYR,
                        'MatriculeDW' => $day->MatriculeDW,
                        'MatriculeTS' => $slot->MatriculeTS,
                        'MatriculeGP' => $group->MatriculeGP,
                        'MatriculeMT' => $matieres->random()->MatriculeMT,
                        'MatriculePR' => $professeur->MatriculePR,
                        'MatriculeSL' => $salle->MatriculeSL,
                    ]);

                    $assigned['group'][$slotKey . '|' . $group->MatriculeGP] = true;
                    $assigned['professeur'][$slotKey . '|' . $professeur->MatriculePR] = true;
                    $assigned['salle'][$slotKey . '|' . $salle->MatriculeSL] = true;
                }
            }
        }
    }
}
