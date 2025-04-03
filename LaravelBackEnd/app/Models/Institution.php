<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use App\Traits\GeneratesMatricule;

class Institution extends Model
{
    use HasFactory, Notifiable, GeneratesMatricule;

    public $incrementing = false;
    protected $primaryKey = "matriculeInst";
    protected $keyType = 'string';

    const CREATED_AT = 'created_at';
    const UPDATED_AT = 'updated_at';

    protected $fillable = [
        'matriculeInst', 'NOMInst', 'ADRESSEInst', 'VILLEInst', 'PAYSInst',
        'CODE_POSTALInst', 'TELEPHONEInst', 'EMAILInst', 'SITE_WEBInst',
        'LOGOInst', 'DESCRIPTIONInst', 'STATUTInst'
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    /**
     * تحديد بادئة الرقم التسلسلي للمؤسسات
     *
     * @return string
     */
    protected static function getMatriculePrefix()
    {
        return 'INST';
    }

    public function groupes()
    {
        return $this->hasMany(Groupe::class, 'matriculeInst');
    }

    public function anneesAcademiques()
    {
        return $this->hasMany(AnneeAcademique::class, 'matriculeInst');
    }

    public function salles()
    {
        return $this->hasMany(Salle::class, 'matriculeInst');
    }

    public function emploisDuTemps()
    {
        return $this->hasMany(EmploiDuTemps::class, 'matriculeInst');
    }
} 