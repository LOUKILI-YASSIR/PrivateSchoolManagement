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
    ];

    protected $casts = [
        'GradeNF' => 'float',
    ];

    // Relationships

    public function etudiant()
    {
        return $this->belongsTo(Etudiant::class, 'MatriculeET', 'MatriculeET');
    }

    // Required method for GeneratesMatricule trait
    protected static function getMatriculePrefix()
    {
        return 'NF';
    }
}
