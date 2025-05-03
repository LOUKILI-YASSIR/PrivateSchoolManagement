<?php

namespace App\Models;

use App\Traits\GeneratesMatricule;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SchoolCalendar extends Model
{
    use HasFactory, GeneratesMatricule;

    protected $primaryKey = 'MatriculeSC';
    public $incrementing = false;
    protected $keyType = 'string';

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'school_calendars';

    protected $fillable = [
        'MatriculeSC',
        'CalendarDateSC',
        'DayTypeSC',
        'MatriculeYR',
    ];

    protected $casts = [
        'CalendarDateSC' => 'date',
    ];

    // Relationships

    public function academicYear()
    {
        return $this->belongsTo(AcademicYear::class, 'MatriculeYR', 'MatriculeYR');
    }

    // Required method for GeneratesMatricule trait
    protected static function getMatriculePrefix()
    {
        return 'SC';
    }
}
