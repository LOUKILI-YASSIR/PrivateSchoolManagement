<?php

namespace App\Models;

use App\Traits\GeneratesMatricule;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EvaluationType extends Model
{
    use HasFactory, GeneratesMatricule;

    protected $primaryKey = 'matriculeEp';
    public $incrementing = false;
    protected $keyType = 'string';

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'evaluation_types';

    protected $fillable = [
        'matriculeEp',
        'nameEp',
        'max_gradeEp',
        'descriptionEp',
        'porsentageEp',
        'codeEp',
    ];

    protected $casts = [
        'max_gradeEp' => 'float',
        'porsentageEp' => 'float',
    ];

    // Relationships

    public function evaluations()
    {
        return $this->hasMany(Evaluation::class, 'matriculeEp', 'matriculeEp');
    }

    // Required method for GeneratesMatricule trait
    protected static function getMatriculePrefix()
    {
        return 'EP';
    }
}
