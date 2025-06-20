<?php

namespace App\Models;

use App\Traits\GeneratesMatricule;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Matiere extends Model
{
    use HasFactory, GeneratesMatricule;

    protected $primaryKey = 'MatriculeMT';
    public $incrementing = false;
    protected $keyType = 'string';

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'matieres';

    protected $fillable = [
        'MatriculeMT',
        'MatriculeYR',
        'NameMT',
        'max_sessions_per_week',
        'CodeMT',
        'DescriptionMT',
        'CoefficientMT',
        'MatriculeNV',
    ];

    protected $casts = [
        'CoefficientMT' => 'float',
    ];

    // Relationships

    public function niveau()
    {
        return $this->belongsTo(Niveau::class, 'MatriculeNV', 'MatriculeNV');
    }

    public function professeurs()
    {
        return $this->hasMany(Professeur::class, 'MatriculeMT', 'MatriculeMT');
    }

    public function evaluations()
    {
        return $this->hasMany(Evaluation::class, 'MatriculeMT', 'MatriculeMT');
    }

    public function notes()
    {
        return $this->hasMany(Note::class, 'MatriculeMT', 'MatriculeMT');
    }

    public function regularTimeTables()
    {
        return $this->hasMany(RegularTimeTable::class, 'MatriculeMT', 'MatriculeMT');
    }

    public function academicYear()
    {
        return $this->belongsTo(AcademicYear::class, 'MatriculeYR', 'MatriculeYR');
    }

    // Required method for GeneratesMatricule trait
    protected static function getMatriculePrefix()
    {
        return 'MT';
    }
}
