<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use App\Traits\GeneratesMatricule;

class AnneeAcademique extends Model
{
    use HasFactory, Notifiable, GeneratesMatricule;

    protected $table = 'annees_academiques';
    public $incrementing = false;
    protected $primaryKey = "matriculeAnnee";
    protected $keyType = 'string';

    const CREATED_AT = 'created_at';
    const UPDATED_AT = 'updated_at';

    protected $fillable = [
        'matriculeAnnee',
        'anneeDebut',
        'anneeFin',
        'dateDebut',
        'dateFin',
        'statut'
    ];

    protected $casts = [
        'matriculeAnnee' => 'string',
        'anneeDebut' => 'integer',
        'anneeFin' => 'integer',
        'dateDebut' => 'date',
        'dateFin' => 'date',
        'statut' => 'string',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    /**
     * تحديد بادئة الرقم التسلسلي للسنوات الدراسية
     *
     * @return string
     */
    protected static function getMatriculePrefix()
    {
        return 'AN';
    }

    public function institution()
    {
        return $this->belongsTo(Institution::class, 'matriculeInst');
    }

    public function inscriptions()
    {
        return $this->hasMany(Inscription::class, 'matriculeAnneeAcademique', 'matriculeAnnee');
    }

    public function evaluations()
    {
        return $this->hasMany(Evaluation::class, 'matriculeAnneeAcademique', 'matriculeAnnee');
    }

    public function emploisDuTemps()
    {
        return $this->hasMany(EmploiDuTemps::class, 'matriculeAnneeAcademique', 'matriculeAnnee');
    }

    public function absencesEtudiants()
    {
        return $this->hasMany(AbsenceEtudiant::class, 'matriculeAnneeAcademique', 'matriculeAnnee');
    }

    public function absencesProfesseurs()
    {
        return $this->hasMany(AbsenceProfesseur::class, 'matriculeAnneeAcademique', 'matriculeAnnee');
    }
} 