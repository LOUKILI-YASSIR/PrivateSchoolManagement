<?php

namespace App\Models;

use App\Traits\GeneratesMatricule;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SpecialDaySchedule extends Model
{
    use HasFactory, GeneratesMatricule;

    protected $primaryKey = 'MatriculeSS';
    public $incrementing = false;
    protected $keyType = 'string';

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'special_day_schedules';

    // Added fillable
    protected $fillable = [
        'MatriculeSS',
        'DateSS',
        'IsFullDaySS',
        'MatriculeTS',
        'LocationSS',
        'ActivityNameSS',
        'MatriculeYR',
    ];

    // Added casts
    protected $casts = [
        'DateSS' => 'date',
        'IsFullDaySS' => 'boolean',
    ];

    // Added relationships
    public function timeSlot()
    {
        return $this->belongsTo(TimeSlot::class, 'MatriculeTS', 'MatriculeTS');
    }

    public function academicYear()
    {
        return $this->belongsTo(AcademicYear::class, 'MatriculeYR', 'MatriculeYR');
    }

    // Required method for GeneratesMatricule trait
    protected static function getMatriculePrefix()
    {
        return 'SS';
    }
}
