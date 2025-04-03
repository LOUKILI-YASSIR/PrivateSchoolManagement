<?php

namespace App\Models;

use App\Traits\GeneratesMatricule;
use Illuminate\Database\Eloquent\Model;

class InscriptionEtudiant extends Model
{
    use GeneratesMatricule;

    protected $table = 'inscriptions_etudiants';
    protected $primaryKey = 'matriculeIns';

    protected $fillable = [
        'matriculeIns',
        'matriculeGrp',
        'matriculeNiv',
        'matriculeAnnee',
        'dateInscription',
        'statut',
    ];

    protected $casts = [
        'dateInscription' => 'datetime',
    ];

    public function groupe()
    {
        return $this->belongsTo(Groupe::class, 'matriculeGrp');
    }

    public function niveau()
    {
        return $this->belongsTo(Niveau::class, 'matriculeNiv');
    }

    public function anneeAcademique()
    {
        return $this->belongsTo(AnneeAcademique::class, 'matriculeAnnee');
    }

    public function absenceEtudiants()
    {
        return $this->hasMany(AbsenceEtudiant::class, 'matriculeIns');
    }

    protected static function getMatriculePrefix()
    {
        return 'INS';
    }
} 