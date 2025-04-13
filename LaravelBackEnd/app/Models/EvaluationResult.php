<?php

namespace App\Models;

use App\Traits\GeneratesMatricule;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EvaluationResult extends Model
{
    use HasFactory, GeneratesMatricule;

    protected $primaryKey = 'matriculeER';
    public $incrementing = false;
    protected $keyType = 'string';

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'evaluation_results';

    protected $fillable = [
        'matriculeER',
        'matriculeEt',
        'matriculeEv',
        'GradeER',
        'commentaireER',
    ];

    protected $casts = [
        'GradeER' => 'float',
    ];

    // Relationships

    public function etudiant()
    {
        return $this->belongsTo(Etudiant::class, 'matriculeEt', 'matriculeEt');
    }

    public function evaluation()
    {
        return $this->belongsTo(Evaluation::class, 'matriculeEv', 'matriculeEv');
    }

    public function gradeAdjustments()
    {
        return $this->hasMany(GradeAdjustment::class, 'matriculeER', 'matriculeER');
    }

    // Required method for GeneratesMatricule trait
    protected static function getMatriculePrefix()
    {
        return 'ER';
    }
}
