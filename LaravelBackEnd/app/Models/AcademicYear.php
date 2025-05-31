<?php

namespace App\Models;

use App\Traits\GeneratesMatricule;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AcademicYear extends Model
{
    use HasFactory, GeneratesMatricule;

    protected $primaryKey = 'MatriculeYR';
    public $incrementing = false;
    protected $keyType = 'string';

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'academic_years';

    protected $fillable = [
        'MatriculeYR',
        'StatusYR',
        'NameYR',
        'DescriptionYR',
        'StartDateYR',
        'EndDateYR',
        'ArchivedDateYR',
        'IsCurrentYR',
        'MatriculeUT',
    ];

    protected $casts = [
        'StartDateYR' => 'date',
        'EndDateYR' => 'date',
        'ArchivedDateYR' => 'date',
        'IsCurrentYR' => 'boolean',
    ];

    // Relationships

    public function user()
    {
        return $this->belongsTo(User::class, 'MatriculeUT', 'MatriculeUT');
    }

    public function schoolCalendars()
    {
        return $this->hasMany(SchoolCalendar::class, 'MatriculeYR', 'MatriculeYR');
    }

    public function holidays()
    {
        return $this->hasMany(Holiday::class, 'MatriculeYR', 'MatriculeYR');
    }

    // New relationships for statistics
    public function professors()
    {
        return $this->hasMany(Professeur::class, 'MatriculeYR', 'MatriculeYR');
    }

    public function students()
    {
        return $this->hasMany(Etudiant::class, 'MatriculeYR', 'MatriculeYR');
    }

    public function subjects()
    {
        return $this->hasMany(Matiere::class, 'MatriculeYR', 'MatriculeYR');
    }

    public function groups()
    {
        return $this->hasMany(Group::class, 'MatriculeYR', 'MatriculeYR');
    }

    public function evaluations()
    {
        return $this->hasMany(Evaluation::class, 'MatriculeYR', 'MatriculeYR');
    }

    // Additional relationships
    public function finalNotes()
    {
        return $this->hasMany(NoteFinal::class, 'MatriculeYR', 'MatriculeYR');
    }

    public function regularTimeTables()
    {
        return $this->hasMany(RegularTimeTable::class, 'MatriculeYR', 'MatriculeYR');
    }

    public function specialDaySchedules()
    {
        return $this->hasMany(SpecialDaySchedule::class, 'MatriculeYR', 'MatriculeYR');
    }

    public function timeTableExceptions()
    {
        return $this->hasMany(TimeTableException::class, 'MatriculeYR', 'MatriculeYR');
    }

    public function schoolEvents()
    {
        return $this->hasMany(SchoolEvent::class, 'MatriculeYR', 'MatriculeYR');
    }

    public function teacherVocations()
    {
        return $this->hasMany(TeacherVocation::class, 'MatriculeYR', 'MatriculeYR');
    }

    public function notes()
    {
        return $this->hasMany(Note::class, 'MatriculeYR', 'MatriculeYR');
    }

    public function evaluationResults()
    {
        return $this->hasMany(EvaluationResult::class, 'MatriculeYR', 'MatriculeYR');
    }

    public function gradeAdjustments()
    {
        return $this->hasMany(GradeAdjustment::class, 'MatriculeYR', 'MatriculeYR');
    }

    public function attendances()
    {
        return $this->hasMany(Attendance::class, 'MatriculeYR', 'MatriculeYR');
    }
    public function salles()
    {
        return $this->hasMany(Salle::class, 'MatriculeYR', 'MatriculeYR');
    }
    public function niveaux()
    {
        return $this->hasMany(Niveau::class, 'MatriculeYR', 'MatriculeYR');
    }

    // Method to get all statistics
    public function getStatistics(): array
    {
        return [
            'niveaux_count' => $this->niveaux()->count(),
            'professors_count' => $this->professors()->count(),
            'students_count' => $this->students()->count(),
            'subjects_count' => $this->subjects()->count(),
            'groups_count' => $this->groups()->count(),
            'salles_count' => $this->salles()->count(),
            'evaluations_count' => $this->evaluations()->count(),
            'final_notes_count' => $this->finalNotes()->count(),
            'regular_timetables_count' => $this->regularTimeTables()->count(),
            'special_schedules_count' => $this->specialDaySchedules()->count(),
            'timetable_exceptions_count' => $this->timeTableExceptions()->count(),
            'school_events_count' => $this->schoolEvents()->count(),
            'teacher_vocations_count' => $this->teacherVocations()->count(),
            'notes_count' => $this->notes()->count(),
            'evaluation_results_count' => $this->evaluationResults()->count(),
            'grade_adjustments_count' => $this->gradeAdjustments()->count(),
            'attendances_count' => $this->attendances()->count(),
            'is_closed' => $this->StatusYR === 'archived' || $this->EndDateYR < now(),
        ];
    }

    // Required method for GeneratesMatricule trait
    protected static function getMatriculePrefix()
    {
        return 'YR';
    }
}
