<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // UserSeeder and AdminUserSeeder are intentionally not modified.
        // Only bootstrap demo users when the users table is empty.
        if (!User::query()->exists()) {
            $this->call(UserSeeder::class);
        }

        $this->call([
            AcademicYearSeeder::class,
            DayWeekSeeder::class,
            TimeSlotSeeder::class,
            NiveauSeeder::class,
            GroupSeeder::class,
            SalleSeeder::class,
            EvaluationTypeSeeder::class,
            ProfesseurSeeder::class,
            MatiereSeeder::class,
            EtudiantSeeder::class,
            GroupsProfesseursSeeder::class,
            SchoolCalendarSeeder::class,
            HolidaySeeder::class,
            RegularTimeTableSeeder::class,
            TimeTableExceptionSeeder::class,
            SpecialDayScheduleSeeder::class,
            SchoolEventSeeder::class,
            EvaluationSeeder::class,
            EvaluationResultSeeder::class,
            NoteSeeder::class,
            NoteFinalSeeder::class,
            GradeAdjustmentSeeder::class,
            AttendanceSeeder::class,
            TeacherVocationSeeder::class,
        ]);
    }
}
