<?php

namespace App\Models;

use App\Traits\GeneratesMatricule; // Import the trait
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GradeAdjustment extends Model
{
    use HasFactory, GeneratesMatricule; // Use the trait

    protected $primaryKey = 'MatriculeGA';
    public $incrementing = false;
    protected $keyType = 'string';

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'grade_adjustments';

    // Added fillable
    protected $fillable = [
        'MatriculeGA',
        'MatriculeYR',
        'TypeGA',
        'ValueGA',
        'ReasonGA',
        'DateGA',
        'MatriculeER',
    ];

    // Added casts
    protected $casts = [
        'ValueGA' => 'float',
        'DateGA' => 'date',
    ];

    // Added relationships
    public function evaluationResult()
    {
        return $this->belongsTo(EvaluationResult::class, 'MatriculeER', 'MatriculeER');
    }

    public function academicYear()
    {
        return $this->belongsTo(AcademicYear::class, 'MatriculeYR', 'MatriculeYR');
    }

    // Required method for GeneratesMatricule trait
    protected static function getMatriculePrefix()
    {
        return 'GA';
    }
}
