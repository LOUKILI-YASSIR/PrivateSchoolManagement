<?php

namespace App\Models;

use App\Traits\GeneratesMatricule;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Etudiant extends Model
{
    use HasFactory, GeneratesMatricule;

    protected $primaryKey = 'matriculeEt';
    public $incrementing = false;
    protected $keyType = 'string';

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'etudiants';

    protected $fillable = [
        'matriculeEt',
        'emailEt',
        'phoneEt',
        'lienParenteTr',
        'professionTr',
        'NomTr',
        'PrenomTr',
        'Phone1Tr',
        'Phone2Tr',
        'EmailTr',
        'ObservationTr',
        'matriculeUt',
        'matriculeGp',
    ];

    // Relationships

    public function user()
    {
        return $this->belongsTo(User::class, 'matriculeUt', 'matriculeUt');
    }

    public function group()
    {
        return $this->belongsTo(Group::class, 'matriculeGp', 'matriculeGp');
    }

    public function attendances()
    {
        return $this->hasMany(Attendance::class, 'matriculeEt', 'matriculeEt');
    }

    public function notes()
    {
        return $this->hasMany(Note::class, 'matriculeEt', 'matriculeEt');
    }

    public function noteFinals()
    {
        return $this->hasMany(NoteFinal::class, 'matriculeEt', 'matriculeEt');
    }

    public function evaluationResults()
    {
        return $this->hasMany(EvaluationResult::class, 'matriculeEt', 'matriculeEt');
    }

    // Required method for GeneratesMatricule trait
    protected static function getMatriculePrefix()
    {
        return 'ET';
    }
}
