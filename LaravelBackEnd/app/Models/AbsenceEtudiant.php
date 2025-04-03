<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\GeneratesMatricule;

class AbsenceEtudiant extends Model
{
    use GeneratesMatricule;

    protected $primaryKey = 'matriculeAbsEt';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'matriculeAbsEt',
        'matriculeEt',
        'matriculeAnnee',
        'dateAbsence',
        'motif',
        'estJustifie',
    ];

    protected $casts = [
        'dateAbsence' => 'date',
        'estJustifie' => 'boolean',
    ];

    public function anneeAcademique()
    {
        return $this->belongsTo(AnneeAcademique::class, 'matriculeAnnee');
    }

    public function etudiant()
    {
        return $this->belongsTo(Etudiant::class, 'matriculeEt');
    }

    protected static function getMatriculePrefix()
    {
        return 'ABS_ET';
    }
}
