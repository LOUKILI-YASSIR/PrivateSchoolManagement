<?php

namespace App\Models;

use App\Traits\GeneratesMatricule;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EvaluationResult extends Model
{
    use HasFactory, GeneratesMatricule;

    protected $primaryKey = 'MatriculeER';
    public $incrementing = false;
    protected $keyType = 'string';

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'evaluation_results';

    protected $fillable = [
        'MatriculeER',
        'MatriculeYR',
        'MatriculeET',
        'MatriculeEV',
        'GradeER',
        'CommentaireER',
    ];

    protected $casts = [
        'GradeER' => 'float',
    ];

    // Relationships

    public function etudiant()
    {
        return $this->belongsTo(Etudiant::class, 'MatriculeET', 'MatriculeET');
    }

    public function evaluation()
    {
        return $this->belongsTo(Evaluation::class, 'MatriculeEV', 'MatriculeEV');
    }

    public function gradeAdjustments()
    {
        return $this->hasMany(GradeAdjustment::class, 'MatriculeER', 'MatriculeER');
    }

    public function academicYear()
    {
        return $this->belongsTo(AcademicYear::class, 'MatriculeYR', 'MatriculeYR');
    }

    // Required method for GeneratesMatricule trait
    protected static function getMatriculePrefix()
    {
        return 'ER';
    }
}
