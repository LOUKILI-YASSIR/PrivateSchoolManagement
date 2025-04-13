<?php

namespace App\Models;

use App\Traits\GeneratesMatricule;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AcademicYear extends Model
{
    use HasFactory, GeneratesMatricule;

    protected $primaryKey = 'matriculeYR';
    public $incrementing = false;
    protected $keyType = 'string';

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'academic_years';

    protected $fillable = [
        'matriculeYR',
        'statusYR',
        'NameYR',
        'descriptionYR',
        'startDateYR',
        'endDateYR',
        'ArchivedDateYR',
        'isCurrentYR',
        'matriculeUt',
    ];

    protected $casts = [
        'startDateYR' => 'date',
        'endDateYR' => 'date',
        'ArchivedDateYR' => 'date',
        'isCurrentYR' => 'boolean',
    ];

    // Relationships

    public function user()
    {
        return $this->belongsTo(User::class, 'matriculeUt', 'matriculeUt');
    }

    public function schoolCalendars()
    {
        return $this->hasMany(SchoolCalendar::class, 'matriculeYR', 'matriculeYR');
    }

    public function holidays()
    {
        return $this->hasMany(Holiday::class, 'matriculeYR', 'matriculeYR');
    }

    // Required method for GeneratesMatricule trait
    protected static function getMatriculePrefix()
    {
        return 'YR';
    }
}
