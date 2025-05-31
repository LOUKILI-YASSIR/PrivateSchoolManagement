<?php

namespace App\Models;

use App\Traits\GeneratesMatricule;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    use HasFactory, GeneratesMatricule;


    protected $primaryKey = 'MatriculeAT';
    public $incrementing = false;
    protected $keyType = 'string';

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'attendances';

    protected $fillable = [
        'MatriculeAT',
        'MatriculeYR',
        'StatusAT',
        'IsJustifAT',
        'JustifAT',
        'DateAT',
        'MatriculeUT',
        'MatriculeET',
        'MatriculePR',
    ];

    protected $casts = [
        'IsJustifAT' => 'boolean',
        'DateAT' => 'date',
    ];

    // Relationships

    public function user()
    {
        return $this->belongsTo(User::class, 'MatriculeUT', 'MatriculeUT');
    }

    public function etudiant()
    {
        return $this->belongsTo(Etudiant::class, 'MatriculeET', 'MatriculeET')->withDefault();
    }

    public function professeur()
    {
        return $this->belongsTo(Professeur::class, 'MatriculePR', 'MatriculePR')->withDefault();
    }

    public function academicYear()
    {
        return $this->belongsTo(AcademicYear::class, 'MatriculeYR', 'MatriculeYR');
    }

    // Required method for GeneratesMatricule trait
    protected static function getMatriculePrefix()
    {
        return 'AT';
    }
}
