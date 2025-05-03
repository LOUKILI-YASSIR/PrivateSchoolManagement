<?php

namespace App\Models;

use App\Traits\GeneratesMatricule;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Note extends Model
{
    use HasFactory, GeneratesMatricule;

    protected $primaryKey = 'MatriculeNT';
    public $incrementing = false;
    protected $keyType = 'string';

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'notes';

    protected $fillable = [
        'MatriculeNT',
        'MatriculeET',
        'MatriculeMT',
        'GradeNT',
        'CommentaireNT',
    ];

    protected $casts = [
        'GradeNT' => 'float',
    ];

    // Relationships

    public function etudiant()
    {
        return $this->belongsTo(Etudiant::class, 'MatriculeET', 'MatriculeET');
    }

    public function matiere()
    {
        return $this->belongsTo(Matiere::class, 'MatriculeMT', 'MatriculeMT');
    }

    // Required method for GeneratesMatricule trait
    protected static function getMatriculePrefix()
    {
        return 'NT';
    }
}
