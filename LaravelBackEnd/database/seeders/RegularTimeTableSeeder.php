<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\RegularTimeTable;
use App\Models\DayWeek;
use App\Models\TimeSlot;
use App\Models\Group;
use App\Models\Matiere;
use App\Models\Professeur;
use App\Models\Salle;
use Illuminate\Support\Facades\DB; // For potential cleanup

class RegularTimeTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Optional: Clean up existing entries first
        // RegularTimeTable::truncate();

        $days = DayWeek::all();
        $timeSlots = TimeSlot::all();
        $groups = Group::all();
        $matieres = Matiere::all();
        $professeurs = Professeur::all();
        $salles = Salle::all();

        if ($days->isEmpty() || $timeSlots->isEmpty() || $groups->isEmpty() || $matieres->isEmpty() || $professeurs->isEmpty() || $salles->isEmpty()) {
            $this->command->warn('Missing prerequisite data (Days, Slots, Groups, Matieres, Professeurs, Salles). Skipping RegularTimeTableSeeder.');
            return;
        }

        // Keep track of assigned slots to avoid basic clashes
        $assignedSlots = [];

        // Attempt to create some timetable entries for each group
        foreach ($groups as $group) {
            // Get matieres relevant to the group's niveau
            $groupMatieres = $matieres->where('matriculeNv', $group->matriculeNv);
            if($groupMatieres->isEmpty()) continue;

            foreach ($days->whereNotIn('dayNameDW', ['Saturday', 'Sunday']) as $day) { // Weekdays only
                foreach ($timeSlots as $timeSlot) {
                    // Simple check: Assign only ~30% of slots randomly to avoid too dense schedule
                    if (rand(1, 10) > 3) continue;

                    $key = $day->matriculeDW . '-' . $timeSlot->matriculeTs;

                    // Basic clash detection (simplified)
                    if (isset($assignedSlots[$key . '-gp-' . $group->matriculeGp]) ||
                        isset($assignedSlots[$key . '-sl-' . $salles->random()->matriculeSl]) || // Random salle for simplicity
                        isset($assignedSlots[$key . '-pr-' . $professeurs->random()->matriculePr])) { // Random prof for simplicity
                        continue; // Skip if group, salle or prof seems busy (very basic check)
                    }

                    $matiere = $groupMatieres->random();
                    $professeur = $professeurs->random(); // Ideally, link matiere to specific prof
                    $salle = $salles->random();

                    RegularTimeTable::factory()->create([
                        'matriculeDW' => $day->matriculeDW,
                        'matriculeTs' => $timeSlot->matriculeTs,
                        'matriculeGp' => $group->matriculeGp,
                        'matriculeMt' => $matiere->matriculeMt,
                        'matriculePr' => $professeur->matriculePr, // Use the matiere's prof if defined?
                        'matriculeSl' => $salle->matriculeSl,
                    ]);

                    // Mark slots as busy (basic)
                    $assignedSlots[$key . '-gp-' . $group->matriculeGp] = true;
                    $assignedSlots[$key . '-sl-' . $salle->matriculeSl] = true;
                    $assignedSlots[$key . '-pr-' . $professeur->matriculePr] = true;
                }
            }
        }
    }
}
