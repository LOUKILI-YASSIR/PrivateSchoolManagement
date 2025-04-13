<?php

namespace App\Models;

use App\Traits\GeneratesMatricule;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Professeur extends Model
{
    use HasFactory, GeneratesMatricule;

    protected $primaryKey = 'matriculePr';
    public $incrementing = false;
    protected $keyType = 'string';

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'professeurs';

    protected $fillable = [
        'matriculePr',
        'CINPr',
        'civilitePr',
        'Phone1Pr',
        'Phone2Pr',
        'DateEmbauchePr',
        'SalairePr',
        'NomBanquePr',
        'RIBPr',
        'matriculeUt',
    ];

    protected $casts = [
        'DateEmbauchePr' => 'date',
        'SalairePr' => 'float',
    ];

    // Relationships

    public function user()
    {
        return $this->belongsTo(User::class, 'matriculeUt', 'matriculeUt');
    }

    public function matieres()
    {
        return $this->hasMany(Matiere::class, 'matriculePr', 'matriculePr');
    }

    public function attendances()
    {
        return $this->hasMany(Attendance::class, 'matriculePr', 'matriculePr');
    }

    public function teacherVocations()
    {
        return $this->hasMany(TeacherVocation::class, 'matriculePr', 'matriculePr');
    }

    public function regularTimeTables()
    {
        return $this->hasMany(RegularTimeTable::class, 'matriculePr', 'matriculePr');
    }

    // Required method for GeneratesMatricule trait
    protected static function getMatriculePrefix()
    {
        return 'PR';
    }
}
