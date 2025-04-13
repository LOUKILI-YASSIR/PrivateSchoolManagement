<?php

namespace App\Models;

use App\Traits\GeneratesMatricule;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TeacherVocation extends Model
{
    use HasFactory, GeneratesMatricule;

    protected $primaryKey = 'matriculeTv';
    public $incrementing = false;
    protected $keyType = 'string';

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'teacher_vocations';

    protected $fillable = [
        'matriculeTv',
        'matriculePr',
        'startDatetv',
        'approvedTv',
        'endDatetv',
    ];

    protected $casts = [
        'startDatetv' => 'date',
        'approvedTv' => 'boolean',
        'endDatetv' => 'date',
    ];

    // Relationships

    public function professeur()
    {
        return $this->belongsTo(Professeur::class, 'matriculePr', 'matriculePr');
    }

    // Required method for GeneratesMatricule trait
    protected static function getMatriculePrefix()
    {
        return 'TV';
    }
}
