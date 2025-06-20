<?php

namespace App\Models;

use App\Traits\GeneratesMatricule;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TimeSlot extends Model
{
    use HasFactory, GeneratesMatricule;

    protected $primaryKey = 'MatriculeTS';
    public $incrementing = false;
    protected $keyType = 'string';

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'time_slots';


    protected $fillable = [
        'MatriculeTS',
        'StartTimeTS',
        'EndTimeTS',
    ];

    // Casts for time columns
    protected $casts = [
        'StartTimeTS' => 'datetime:H:i',
        'EndTimeTS' => 'datetime:H:i',
    ];

    // Relationships

    public function regularTimeTables()
    {
        return $this->hasMany(RegularTimeTable::class, 'MatriculeTS', 'MatriculeTS');
    }

    public function schoolEvents()
    {
        return $this->hasMany(SchoolEvent::class, 'MatriculeTS', 'MatriculeTS');
    }

    public function specialDaySchedules()
    {
        return $this->hasMany(SpecialDaySchedule::class, 'MatriculeTS', 'MatriculeTS');
    }

    public function timeTableExceptions()
    {
        return $this->hasMany(TimeTableException::class, 'MatriculeTS', 'MatriculeTS');
    }

    public function replacingTimeTableExceptions()
    {
        return $this->hasMany(TimeTableException::class, 'NewMatriculeTs', 'MatriculeTS');
    }

    // Required method for GeneratesMatricule trait
    protected static function getMatriculePrefix()
    {
        return 'TS';
    }
}
