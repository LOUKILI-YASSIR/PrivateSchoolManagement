<?php

namespace App\Models;

use App\Traits\GeneratesMatricule;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Niveau extends Model
{
    use HasFactory, GeneratesMatricule;

    protected $primaryKey = 'MatriculeNV';
    public $incrementing = false;
    protected $keyType = 'string';

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'niveaux';

    protected $fillable = [
        'MatriculeNV',
        'CodeNV',
        'NomNV',
        'SubMatriculeNV',
        'TypeNV',
        'DescriptionNV',
        'StatusNV',
    ];

    // Relationships

    public function matieres()
    {
        return $this->hasMany(Matiere::class, 'MatriculeNV', 'MatriculeNV');
    }

    public function groups()
    {
        return $this->hasMany(Group::class, 'MatriculeNV', 'MatriculeNV');
    }

    // Self-referencing relationships
    public function parent()
    {
        return $this->belongsTo(Niveau::class, 'SubMatriculeNV', 'MatriculeNV');
    }

    public function children()
    {
        return $this->hasMany(Niveau::class, 'SubMatriculeNV', 'MatriculeNV');
    }

    // Required method for GeneratesMatricule trait
    protected static function getMatriculePrefix()
    {
        return 'NV';
    }
}
