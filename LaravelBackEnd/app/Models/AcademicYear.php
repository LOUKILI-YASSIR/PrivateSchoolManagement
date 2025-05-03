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

    // Required method for GeneratesMatricule trait
    protected static function getMatriculePrefix()
    {
        return 'YR';
    }
}
