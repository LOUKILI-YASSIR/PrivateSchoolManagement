<?php

namespace Database\Seeders;

use App\Models\AcademicYear;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class AcademicYearSeeder extends Seeder
{
    public function run(): void
    {
        // RoleUT identifies the user's role; StatutUT is the account status.
        $admin = User::query()->where('RoleUT', 'admin')->first();

        if (!$admin) {
            $this->command?->warn('Admin user not found. Run UserSeeder before AcademicYearSeeder.');
            return;
        }

        $now = Carbon::now();
        $startYear = $now->month >= 9 ? $now->year : $now->year - 1;
        $endYear = $startYear + 1;

        $current = AcademicYear::firstOrCreate(
            ['NameYR' => "{$startYear}-{$endYear}"],
            [
                'StatusYR' => 'Active',
                'StartDateYR' => Carbon::create($startYear, 9, 1)->toDateString(),
                'EndDateYR' => Carbon::create($endYear, 8, 31)->toDateString(),
                'IsCurrentYR' => true,
                'MatriculeUT' => $admin->MatriculeUT,
            ]
        );

        AcademicYear::query()
            ->where('IsCurrentYR', true)
            ->where('MatriculeYR', '!=', $current->MatriculeYR)
            ->update(['IsCurrentYR' => false]);

        if (!$current->IsCurrentYR || $current->StatusYR !== 'Active') {
            $current->update(['IsCurrentYR' => true, 'StatusYR' => 'Active']);
        }

        // Keep two historical years without creating extra User records.
        foreach ([2, 1] as $offset) {
            $pastStart = $startYear - $offset;
            $pastEnd = $pastStart + 1;
            AcademicYear::firstOrCreate(
                ['NameYR' => "{$pastStart}-{$pastEnd}"],
                [
                    'StatusYR' => 'Archived',
                    'StartDateYR' => Carbon::create($pastStart, 9, 1)->toDateString(),
                    'EndDateYR' => Carbon::create($pastEnd, 8, 31)->toDateString(),
                    'IsCurrentYR' => false,
                    'MatriculeUT' => $admin->MatriculeUT,
                ]
            );
        }
    }
}
