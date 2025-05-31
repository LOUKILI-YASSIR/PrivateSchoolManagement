<?php

namespace App\Models;

use App\Traits\GeneratesMatricule;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TimeTableException extends Model
{
    use HasFactory, GeneratesMatricule;

    protected $primaryKey = 'MatriculeTE';
    public $incrementing = false;
    protected $keyType = 'string';

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'time_table_exceptions';

    protected $fillable = [
        'MatriculeTE',
        'MatriculeYR',
        'ExceptionTypeTE',
        'ExceptionDateTE',
        'IsFulldayTE',
        'MatriculeTS',
        'ReasonTE',
        'NewMatriculeTS',
    ];

    protected $casts = [
        'ExceptionDateTE' => 'date',
        'IsFulldayTE' => 'boolean',
    ];

    public function timeSlot()
    {
        return $this->belongsTo(TimeSlot::class, 'MatriculeTS', 'MatriculeTS');
    }

    public function newTimeSlot()
    {
        return $this->belongsTo(TimeSlot::class, 'NewMatriculeTS', 'MatriculeTS')->withDefault();
    }

    public function academicYear()
    {
        return $this->belongsTo(AcademicYear::class, 'MatriculeYR', 'MatriculeYR');
    }

    protected static function getMatriculePrefix()
    {
        return 'TE';
    }
}
