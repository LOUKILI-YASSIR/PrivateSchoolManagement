<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Inscription extends Model
{
    use HasFactory;

    protected $table = 'inscription_etudiants';

    protected $fillable = [
        'matriculeEtudiant',
        'matriculeGroupe',
        'matriculeAnneeAcademique',
        'dateInscription',
        'statut'
    ];

    protected $casts = [
        'dateInscription' => 'date'
    ];

    public function etudiant()
    {
        return $this->belongsTo(Etudiant::class, 'matriculeEtudiant', 'matriculeEt');
    }

    public function groupe()
    {
        return $this->belongsTo(Groupe::class, 'matriculeGroupe', 'matriculeGrp');
    }

    public function anneeAcademique()
    {
        return $this->belongsTo(AnneeAcademique::class, 'matriculeAnneeAcademique', 'matriculeAnnee');
    }
} 