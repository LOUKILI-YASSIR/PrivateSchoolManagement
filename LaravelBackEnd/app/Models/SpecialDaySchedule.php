<?php

namespace App\Models;

use App\Traits\GeneratesMatricule;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SpecialDaySchedule extends Model
{
    use HasFactory, GeneratesMatricule;

    protected $primaryKey = 'matriculeSS';
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
        'matriculeSS',
        'dateSS',
        'isFulldaySS',
        'matriculeTs',
        'locationSS',
        'activityNameSS',
    ];

    // Added casts
    protected $casts = [
        'dateSS' => 'date',
        'isFulldaySS' => 'boolean',
    ];

    // Added relationships
    public function timeSlot()
    {
        return $this->belongsTo(TimeSlot::class, 'matriculeTs', 'matriculeTs');
    }

    // Required method for GeneratesMatricule trait
    protected static function getMatriculePrefix()
    {
        return 'SS';
    }
}
