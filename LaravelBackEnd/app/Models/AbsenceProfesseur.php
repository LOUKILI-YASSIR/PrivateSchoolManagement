<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\GeneratesMatricule;

class AbsenceProfesseur extends Model
{
    use GeneratesMatricule;

    protected $primaryKey = 'matriculeAbs';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'matriculeAbs',
        'matriculePR',
        'matriculeAnnee',
        'dateAbsence',
        'justifie',
        'commentaire',
    ];

    protected $casts = [
        'dateAbsence' => 'date',
        'justifie' => 'boolean',
    ];

    public function professeur()
    {
        return $this->belongsTo(Professeur::class, 'matriculePR');
    }

    public function anneeAcademique()
    {
        return $this->belongsTo(AnneeAcademique::class, 'matriculeAnnee');
    }

    protected static function getMatriculePrefix()
    {
        return 'ABS_PR';
    }
}
