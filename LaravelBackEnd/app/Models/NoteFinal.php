<?php

namespace App\Models;

use App\Traits\GeneratesMatricule;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NoteFinal extends Model
{
    use HasFactory, GeneratesMatricule;

    protected $primaryKey = 'matriculeNf';
    public $incrementing = false;
    protected $keyType = 'string';

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'note_finals';

    protected $fillable = [
        'matriculeNf',
        'matriculeEt',
        'gradeNf',
        'commentaireNf',
    ];

    protected $casts = [
        'gradeNf' => 'float',
    ];

    // Relationships

    public function etudiant()
    {
        return $this->belongsTo(Etudiant::class, 'matriculeEt', 'matriculeEt');
    }

    // Required method for GeneratesMatricule trait
    protected static function getMatriculePrefix()
    {
        return 'NF';
    }
}
