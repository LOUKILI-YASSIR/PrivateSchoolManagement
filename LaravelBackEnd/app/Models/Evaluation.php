<?php

namespace App\Models;

use App\Traits\GeneratesMatricule;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Evaluation extends Model
{
    use HasFactory, GeneratesMatricule;

    protected $primaryKey = 'MatriculeEV';
    public $incrementing = false;
    protected $keyType = 'string';

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'evaluations';

    protected $fillable = [
        'MatriculeEV',
        'MatriculeMT',
        'MatriculeEP',
        'NbrEV',
    ];

    protected $casts = [
        'NbrEV' => 'integer',
    ];

    // Relationships

    public function matiere()
    {
        return $this->belongsTo(Matiere::class, 'MatriculeMT', 'MatriculeMT');
    }

    public function evaluationType()
    {
        return $this->belongsTo(EvaluationType::class, 'MatriculeEP', 'MatriculeEP');
    }

    public function evaluationResults()
    {
        return $this->hasMany(EvaluationResult::class, 'MatriculeEV', 'MatriculeEV');
    }

    // Required method for GeneratesMatricule trait
    protected static function getMatriculePrefix()
    {
        return 'EV';
    }
}
