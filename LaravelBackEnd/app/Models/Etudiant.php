<?php

namespace App\Models;

use App\Traits\GeneratesMatricule;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Etudiant extends Model
{
    use HasFactory, GeneratesMatricule;

    protected $primaryKey = 'MatriculeET';
    public $incrementing = false;
    protected $keyType = 'string';

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'etudiants';

    protected $fillable = [
        'MatriculeET',
        'MatriculeYR',
        'EmailET',
        'PhoneET',
        'LienParenteTR',
        'ProfessionTR',
        'NomTR',
        'PrenomTR',
        'Phone1TR',
        'Phone2TR',
        'EmailTR',
        'ObservationTR',
        'MatriculeUT',
        'MatriculeGP',
        'MatriculeNV',
    ];

    // Relationships

    public function user()
    {
        return $this->belongsTo(User::class, 'MatriculeUT', 'MatriculeUT');
    }

    public function group()
    {
        return $this->belongsTo(Group::class, 'MatriculeGP', 'MatriculeGP');
    }

    public function niveau()
    {
        return $this->belongsTo(Niveau::class, 'MatriculeNV', 'MatriculeNV');
    }

    public function attendances()
    {
        return $this->hasMany(Attendance::class, 'MatriculeET', 'MatriculeET');
    }

    public function notes()
    {
        return $this->hasMany(Note::class, 'MatriculeET', 'MatriculeET');
    }

    public function noteFinals()
    {
        return $this->hasMany(NoteFinal::class, 'MatriculeET', 'MatriculeET');
    }

    public function evaluationResults()
    {
        return $this->hasMany(EvaluationResult::class, 'MatriculeET', 'MatriculeET');
    }

    public function academicYear()
    {
        return $this->belongsTo(AcademicYear::class, 'MatriculeYR', 'MatriculeYR');
    }

    // Required method for GeneratesMatricule trait
    protected static function getMatriculePrefix()
    {
        return 'ET';
    }
}
