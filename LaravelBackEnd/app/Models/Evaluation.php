<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use \App\Traits\GeneratesMatricule;

class Evaluation extends Model
{
    use HasFactory, Notifiable, GeneratesMatricule;

    public $incrementing = false;
    protected $primaryKey = "matriculeEvl";
    protected $keyType = 'string';

    const CREATED_AT = 'created_at';
    const UPDATED_AT = 'updated_at';

    protected $fillable = [
        'matriculeEvl', 'matriculeEt', 'matriculeMat', 'matriculeAnnee',
        'typeEvaluation', 'max_grade', 'percentage', 'extraPar'
    ];

    protected $casts = [
        'max_grade' => 'decimal:5,2',
        "percentage" => 'float',
        'extraPar' => 'string',
        'matriculeEvl' => 'string',
        'matriculeEt' => 'string',
        'matriculeMat' => 'string',
        'matriculeAnnee' => 'string',
        'typeEvaluation' => 'string',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    public function etudiant()
    {
        return $this->belongsTo(Etudiant::class, 'matriculeEt');
    }

    public function matiere()
    {
        return $this->belongsTo(Matiere::class, 'matriculeMat');
    }

    public function anneeAcademique()
    {
        return $this->belongsTo(AnneeAcademique::class, 'matriculeAnnee');
    }

    /**
     * تحديد بادئة الرقم التسلسلي للتقييمات
     *
     * @return string
     */
    protected static function getMatriculePrefix()
    {
        return 'EVL';
    }
}
