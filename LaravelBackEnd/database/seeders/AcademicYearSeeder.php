<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\AcademicYear;
use App\Models\User;
use Carbon\Carbon;

class AcademicYearSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin = User::where('StatutUT', 'admin')->first();
        if (!$admin) {
            $this->command->warn('Admin user not found. Skipping AcademicYearSeeder. Please run UserSeeder first.');
            return;
        }

        // Ensure only one year is current
        AcademicYear::query()->update(['IsCurrentYR' => false]);

        // Create the current academic year
        AcademicYear::factory()
            ->current()
            ->createdBy($admin->MatriculeUT)
            ->create([
                'StartDateYR' => Carbon::now()->year . '-09-01',
                'EndDateYR' => (Carbon::now()->year + 1) . '-08-31',
            ]);

        // Create a couple of past academic years
        AcademicYear::factory(2)
            ->createdBy($admin->MatriculeUT)
            ->create([
                'StatusYR' => 'Archived',
                'IsCurrentYR' => false,
                // Factory definition handles date generation for past years
            ]);
    }
}
