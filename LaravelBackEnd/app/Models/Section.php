<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use App\Traits\GeneratesMatricule;

class Section extends Model
{
    use HasFactory, Notifiable, GeneratesMatricule;

    public $incrementing = false;
    protected $primaryKey = "matriculeSect";
    protected $keyType = 'string';

    const CREATED_AT = 'created_at';
    const UPDATED_AT = 'updated_at';

    protected $fillable = [
        'matriculeSect', 'NOMsect', 'DESCRIPTIONsect', 'STATUTsect',
        'matriculeAnnee'
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    /**
     * تحديد بادئة الرقم التسلسلي للأقسام
     *
     * @return string
     */
    protected static function getMatriculePrefix()
    {
        return 'SECT';
    }

    public function anneeAcademique()
    {
        return $this->belongsTo(AnneeAcademique::class, 'matriculeAnnee');
    }

    public function matieres()
    {
        return $this->hasMany(Matiere::class, 'matriculeSect');
    }

    public function groupes()
    {
        return $this->hasMany(Groupe::class, 'matriculeSect');
    }
} 