<?php

namespace App\Models;

use App\Traits\GeneratesMatricule;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Evaluation extends Model
{
    use HasFactory, GeneratesMatricule;

    protected $primaryKey = 'matriculeEv';
    public $incrementing = false;
    protected $keyType = 'string';

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'evaluations';

    protected $fillable = [
        'matriculeEv',
        'matriculeMt',
        'matriculeEp',
        'nbrEv',
    ];

    protected $casts = [
        'nbrEv' => 'integer',
    ];

    // Relationships

    public function matiere()
    {
        return $this->belongsTo(Matiere::class, 'matriculeMt', 'matriculeMt');
    }

    public function evaluationType()
    {
        return $this->belongsTo(EvaluationType::class, 'matriculeEp', 'matriculeEp');
    }

    public function evaluationResults()
    {
        return $this->hasMany(EvaluationResult::class, 'matriculeEv', 'matriculeEv');
    }

    // Required method for GeneratesMatricule trait
    protected static function getMatriculePrefix()
    {
        return 'EV';
    }
}
