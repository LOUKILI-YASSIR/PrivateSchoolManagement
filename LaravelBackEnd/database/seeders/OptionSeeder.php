<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class OptionSeeder extends Seeder
{
    public function run(): void
    {
        // Intentionally empty: the current schema has no options table or
        // corresponding Option model. Keep this seeder out of DatabaseSeeder.
        $this->command?->info('OptionSeeder skipped: no options table is defined in the current schema.');
    }
}
