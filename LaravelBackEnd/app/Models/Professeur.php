<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use App\Traits\GeneratesMatricule;

class Professeur extends Model
{
    use HasFactory, Notifiable, GeneratesMatricule;

    public $incrementing = false;
    protected $primaryKey = "matriculePr";
    protected $keyType = 'string';

    const CREATED_AT = 'created_at';
    const UPDATED_AT = 'updated_at';

    protected $fillable = [
        'matriculePr', 'GENREPr', 'NOMPr', 'PRENOMPr', 'LIEU_NAISSANCEPr', 'DATE_NAISSANCEPr',
        'NATIONALITEPr', 'ADRESSEPr', 'VILLEPr', 'PAYSPr', 'CODE_POSTALPr', 'EMAILPr',
        'TELEPHONE1Pr', 'TELEPHONE2Pr', 'PROFILE_PICTUREPr', 'OBSERVATIONPr', 'SPECIALITEPr',
        'DIPLOME_SUPPr', 'ANNEE_EXPPr', 'STATUT_EMPLOIPr'
    ];

    protected $casts = [
        'DATE_NAISSANCEPr' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'ANNEE_EXPPr' => 'integer'
    ];

    /**
     * Get the user associated with the teacher.
     */
    public function user()
    {
        return $this->hasOne(User::class, 'matricule', 'matriculePr');
    }

    /**
     * تحديد بادئة الرقم التسلسلي للأساتذة
     *
     * @return string
     */
    protected static function getMatriculePrefix()
    {
        return 'PR';
    }

    public function groupes()
    {
        return $this->belongsToMany(Groupe::class, 'professeur_groupes', 'matriculePr', 'matriculeGrp');
    }

    public function matieres()
    {
        return $this->belongsToMany(Matiere::class, 'affectation_professeurs', 'matriculePr', 'matriculeMat');
    }

    public function absences()
    {
        return $this->hasMany(AbsenceProfesseur::class, 'matriculePr');
    }

    public function emploisDuTemps()
    {
        return $this->hasMany(EmploiDuTemps::class, 'matriculePr');
    }

    /**
     * Alias for emploisDuTemps to maintain consistent naming in the code
     */
    public function schedule()
    {
        return $this->emploisDuTemps();
    }
}
