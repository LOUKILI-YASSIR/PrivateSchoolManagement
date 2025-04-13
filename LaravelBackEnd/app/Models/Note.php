<?php

namespace App\Models;

use App\Traits\GeneratesMatricule;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Note extends Model
{
    use HasFactory, GeneratesMatricule;

    protected $primaryKey = 'matriculeNt';
    public $incrementing = false;
    protected $keyType = 'string';

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'notes';

    protected $fillable = [
        'matriculeNt',
        'matriculeEt',
        'matriculeMt',
        'gradeNt',
        'commentaireNt',
    ];

    protected $casts = [
        'gradeNt' => 'float',
    ];

    // Relationships

    public function etudiant()
    {
        return $this->belongsTo(Etudiant::class, 'matriculeEt', 'matriculeEt');
    }

    public function matiere()
    {
        return $this->belongsTo(Matiere::class, 'matriculeMt', 'matriculeMt');
    }

    // Required method for GeneratesMatricule trait
    protected static function getMatriculePrefix()
    {
        return 'NT';
    }
}
