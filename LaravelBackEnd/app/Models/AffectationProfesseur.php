<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\GeneratesMatricule;

class AffectationProfesseur extends Model
{
    use GeneratesMatricule;

    protected $primaryKey = 'matriculeAffect';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'matriculeAffect',
        'matriculePR',
        'matriculeGrp',
        'matriculeMat',
        'matriculeAnnee',
    ];

    protected $casts = [
        'dateAffectation' => 'date',
    ];

    public function professeur()
    {
        return $this->belongsTo(Professeur::class, 'matriculePR');
    }

    public function groupe()
    {
        return $this->belongsTo(Groupe::class, 'matriculeGrp');
    }

    public function matiere()
    {
        return $this->belongsTo(Matiere::class, 'matriculeMat');
    }

    public function anneeAcademique()
    {
        return $this->belongsTo(AnneeAcademique::class, 'matriculeAnnee');
    }

    public function emploiDuTemps()
    {
        return $this->hasMany(EmploiDuTemps::class, 'matriculeAffect');
    }

    protected static function getMatriculePrefix()
    {
        return 'AFF_PR';
    }
}
