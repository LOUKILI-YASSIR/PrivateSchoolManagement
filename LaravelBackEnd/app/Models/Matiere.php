<?php

namespace App\Models;

use App\Traits\GeneratesMatricule;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Matiere extends Model
{
    use HasFactory, GeneratesMatricule;

    protected $primaryKey = 'matriculeMt';
    public $incrementing = false;
    protected $keyType = 'string';

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'matieres';

    protected $fillable = [
        'matriculeMt',
        'nameMt',
        'codeMt',
        'descriptionMt',
        'coefficientMt',
        'matriculeNv',
        'matriculePr',
    ];

    protected $casts = [
        'coefficientMt' => 'float',
    ];

    // Relationships

    public function niveau()
    {
        return $this->belongsTo(Niveau::class, 'matriculeNv', 'matriculeNv');
    }

    public function professeur()
    {
        return $this->belongsTo(Professeur::class, 'matriculePr', 'matriculePr');
    }

    public function evaluations()
    {
        return $this->hasMany(Evaluation::class, 'matriculeMt', 'matriculeMt');
    }

    public function notes()
    {
        return $this->hasMany(Note::class, 'matriculeMt', 'matriculeMt');
    }

    public function regularTimeTables()
    {
        return $this->hasMany(RegularTimeTable::class, 'matriculeMt', 'matriculeMt');
    }

    // Required method for GeneratesMatricule trait
    protected static function getMatriculePrefix()
    {
        return 'MT';
    }
}
