<?php

namespace App\Models;

use App\Traits\GeneratesMatricule;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TimeTableException extends Model
{
    use HasFactory, GeneratesMatricule;

    protected $primaryKey = 'matriculeTe';
    public $incrementing = false;
    protected $keyType = 'string';

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'time_table_exceptions';

    protected $fillable = [
        'matriculeTe',
        'exceptionTypeTe',
        'exceptionDateTe',
        'isFulldayTe',
        'matriculeTs',
        'reasonTe',
        'newMatriculeTs',
    ];

    protected $casts = [
        'exceptionDateTe' => 'date',
        'isFulldayTe' => 'boolean',
    ];

    public function timeSlot()
    {
        return $this->belongsTo(TimeSlot::class, 'matriculeTs', 'matriculeTs');
    }

    public function newTimeSlot()
    {
        return $this->belongsTo(TimeSlot::class, 'newMatriculeTs', 'matriculeTs')->withDefault();
    }

    protected static function getMatriculePrefix()
    {
        return 'TE';
    }
}
