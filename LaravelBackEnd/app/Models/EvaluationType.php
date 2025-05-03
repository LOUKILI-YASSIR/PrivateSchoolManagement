<?php

namespace App\Models;

use App\Traits\GeneratesMatricule;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EvaluationType extends Model
{
    use HasFactory, GeneratesMatricule;

    protected $primaryKey = 'MatriculeEP';
    public $incrementing = false;
    protected $keyType = 'string';

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'evaluation_types';

    protected $fillable = [
        'MatriculeEP',
        'NameEP',
        'MaxGradeEP',
        'DescriptionEP',
        'PorsentageEP',
        'CodeEP',
    ];

    protected $casts = [
        'MaxGradeEP' => 'float',
        'PorsentageEP' => 'float',
    ];

    // Relationships

    public function evaluations()
    {
        return $this->hasMany(Evaluation::class, 'MatriculeEP', 'MatriculeEP');
    }

    // Required method for GeneratesMatricule trait
    protected static function getMatriculePrefix()
    {
        return 'EP';
    }
}
