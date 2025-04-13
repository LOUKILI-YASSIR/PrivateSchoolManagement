<?php

namespace Database\Factories;

use App\Models\RegularTimeTable;
use App\Models\DayWeek;
use App\Models\TimeSlot;
use App\Models\Group;
use App\Models\Matiere;
use App\Models\Professeur;
use App\Models\Salle;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\RegularTimeTable>
 */
class RegularTimeTableFactory extends Factory
{
    protected $model = RegularTimeTable::class;
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // These should ideally be replaced by existing models in the seeder
        return [
            // 'matriculeRt' handled by trait
            'matriculeDW' => DayWeek::factory(),
            'matriculeTs' => TimeSlot::factory(),
            'matriculeGp' => Group::factory(),
            'matriculeMt' => Matiere::factory(),
            'matriculePr' => Professeur::factory(),
            'matriculeSl' => Salle::factory(),
        ];
    }
}
