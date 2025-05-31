<?php

namespace App\Models;

use App\Traits\GeneratesMatricule;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NoteFinal extends Model
{
    use HasFactory, GeneratesMatricule;

    protected $primaryKey = 'matriculeNF';
    public $incrementing = false;
    protected $keyType = 'string';

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'note_finals';

    protected $fillable = [
        'matriculeNF',
        'MatriculeET',
        'GradeNF',
        'CommentaireNF',
        'MatriculeYR',
    ];

    protected $casts = [
        'GradeNF' => 'float',
    ];

    // Relationships

    public function etudiant()
    {
        return $this->belongsTo(Etudiant::class, 'MatriculeET', 'MatriculeET');
    }

    public function academicYear()
    {
        return $this->belongsTo(AcademicYear::class, 'MatriculeYR', 'MatriculeYR');
    }

    // Required method for GeneratesMatricule trait
    protected static function getMatriculePrefix()
    {
        return 'NF';
    }
}
