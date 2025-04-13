<?php

namespace App\Models;

use App\Traits\GeneratesMatricule;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TimeSlot extends Model
{
    use HasFactory, GeneratesMatricule;

    protected $primaryKey = 'matriculeTs';
    public $incrementing = false;
    protected $keyType = 'string';

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'time_slots';


    protected $fillable = [
        'matriculeTs',
        'startTimeTs',
        'endTimeTs',
    ];

    // Casts for time columns
    protected $casts = [
        'startTimeTs' => 'datetime:H:i:s',
        'endTimeTs' => 'datetime:H:i:s',
    ];

    // Relationships

    public function regularTimeTables()
    {
        return $this->hasMany(RegularTimeTable::class, 'matriculeTs', 'matriculeTs');
    }

    public function schoolEvents()
    {
        return $this->hasMany(SchoolEvent::class, 'matriculeTs', 'matriculeTs');
    }

    public function specialDaySchedules()
    {
        return $this->hasMany(SpecialDaySchedule::class, 'matriculeTs', 'matriculeTs');
    }

    public function timeTableExceptions()
    {
        return $this->hasMany(TimeTableException::class, 'matriculeTs', 'matriculeTs');
    }

    public function replacingTimeTableExceptions()
    {
        return $this->hasMany(TimeTableException::class, 'newMatriculeTs', 'matriculeTs');
    }

    // Required method for GeneratesMatricule trait
    protected static function getMatriculePrefix()
    {
        return 'TS';
    }
}
