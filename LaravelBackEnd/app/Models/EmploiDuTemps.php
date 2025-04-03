<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use App\Traits\GeneratesMatricule;

class EmploiDuTemps extends Model
{
    use HasFactory, Notifiable, GeneratesMatricule;

    public $incrementing = false;
    protected $primaryKey = "matriculeEmpt";
    protected $keyType = 'string';

    const CREATED_AT = 'created_at';
    const UPDATED_AT = 'updated_at';

    protected $fillable = [
        'matriculeEmpt', 'matriculeMat', 'matriculeGrp', 'matriculeSes',
        'matriculeAnnee', 'matriculeSalle', 'matriculeInst', 'matriculePer',
        'matriculePr', 'HEURE_DEBUTempt', 'HEURE_FINempt', 'JOUR_SEMAINEempt'
    ];

    protected $casts = [
        'HEURE_DEBUTempt' => 'datetime',
        'HEURE_FINempt' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    /**
     * تحديد بادئة الرقم التسلسلي للجداول الزمنية
     *
     * @return string
     */
    protected static function getMatriculePrefix()
    {
        return 'EDT';
    }

    public function matiere()
    {
        return $this->belongsTo(Matiere::class, 'matriculeMat');
    }

    public function groupe()
    {
        return $this->belongsTo(Groupe::class, 'matriculeGrp');
    }

    public function anneeAcademique()
    {
        return $this->belongsTo(AnneeAcademique::class, 'matriculeAnnee');
    }

    public function salle()
    {
        return $this->belongsTo(Salle::class, 'matriculeSalle');
    }

    public function institution()
    {
        return $this->belongsTo(Institution::class, 'matriculeInst');
    }

    public function periode()
    {
        return $this->belongsTo(Periode::class, 'matriculePer');
    }

    public function professeur()
    {
        return $this->belongsTo(Professeur::class, 'matriculePr');
    }

    // Add user relationship for dashboard queries
    public function user()
    {
        return $this->belongsTo(User::class, 'matriculePr', 'matriculeUt');
    }
} 