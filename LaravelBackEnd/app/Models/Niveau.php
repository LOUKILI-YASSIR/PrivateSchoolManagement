<?php

namespace App\Models;

use App\Traits\GeneratesMatricule;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Niveau extends Model
{
    use HasFactory, GeneratesMatricule;

    protected $primaryKey = 'matriculeNv';
    public $incrementing = false;
    protected $keyType = 'string';

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'niveaux';

    protected $fillable = [
        'matriculeNv',
        'codeNv',
        'NomNv',
        'parent_matriculeNv',
        'typeNv',
        'descriptionNv',
        'statusNv',
    ];

    // Relationships

    public function matieres()
    {
        return $this->hasMany(Matiere::class, 'matriculeNv', 'matriculeNv');
    }

    public function groups()
    {
        return $this->hasMany(Group::class, 'matriculeNv', 'matriculeNv');
    }

    // Self-referencing relationships
    public function parent()
    {
        return $this->belongsTo(Niveau::class, 'parent_matriculeNv', 'matriculeNv');
    }

    public function children()
    {
        return $this->hasMany(Niveau::class, 'parent_matriculeNv', 'matriculeNv');
    }

    // Required method for GeneratesMatricule trait
    protected static function getMatriculePrefix()
    {
        return 'NV';
    }
}
