<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        $this->call([
            // Core / Independent First
            //DayWeekSeeder::class,
            //SalleSeeder::class,
            //EvaluationTypeSeeder::class,
            //NiveauSeeder::class,        // Needed by Group, Matiere
            //TimeSlotSeeder::class,      // Needed by Timetable, Events, Exceptions

            // Users & Roles
            UserSeeder::class,          // Creates Admin
            //ProfesseurSeeder::class,    // Creates Professeurs & their Users
//
            //// Course Structure
            //GroupSeeder::class,         // Needs Niveau
            //EtudiantSeeder::class,      // Needs Group, creates Etudiants & their Users
            //MatiereSeeder::class,       // Needs Niveau, Professeur

            // Academic Year & Calendar
            //AcademicYearSeeder::class,    // Needs User (Admin)
            //SchoolCalendarSeeder::class, // Needs AcademicYear
            //HolidaySeeder::class,         // Needs AcademicYear, updates SchoolCalendar

            // Timetabling
            //RegularTimeTableSeeder::class, // Needs DayWeek, TimeSlot, Group, Matiere, Professeur, Salle
            //TimeTableExceptionSeeder::class, // Needs TimeSlot
            //SpecialDayScheduleSeeder::class, // Needs TimeSlot
            //SchoolEventSeeder::class,      // Needs TimeSlot

            // Evaluations & Notes
            //EvaluationSeeder::class,        // Needs Matiere, EvaluationType
            ////EvaluationResultSeeder::class, // Needs Evaluation, Etudiant
            //NoteSeeder::class,              // Needs Etudiant, Matiere
            //NoteFinalSeeder::class,         // Needs Etudiant
            ////GradeAdjustmentSeeder::class,   // Needs EvaluationResul//t

            // Miscellaneous
            //AttendanceSeeder::class,       // Needs Etudiant, Professeur
            //TeacherVocationSeeder::class, // Needs Professeur
        ]);
    }
}
