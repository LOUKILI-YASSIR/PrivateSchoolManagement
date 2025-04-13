<?php

namespace App\Models;

use App\Traits\GeneratesMatricule; // Import the trait
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GradeAdjustment extends Model
{
    use HasFactory, GeneratesMatricule; // Use the trait

    protected $primaryKey = 'matriculeGA';
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
        'matriculeGA',
        'typeGA',
        'valueGA',
        'reasonGA',
        'DateGa',
        'matriculeER',
    ];

    // Added casts
    protected $casts = [
        'valueGA' => 'float',
        'DateGa' => 'date',
    ];

    // Added relationships
    public function evaluationResult()
    {
        return $this->belongsTo(EvaluationResult::class, 'matriculeER', 'matriculeER');
    }

    // Required method for GeneratesMatricule trait
    protected static function getMatriculePrefix()
    {
        return 'GA';
    }
}
