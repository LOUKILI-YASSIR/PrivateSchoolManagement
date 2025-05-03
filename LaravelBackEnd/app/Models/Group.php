<?php

namespace App\Models;

use App\Traits\GeneratesMatricule;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Group extends Model
{
    use HasFactory, GeneratesMatricule;

    protected $primaryKey = 'MatriculeGP';
    public $incrementing = false;
    protected $keyType = 'string';

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'groups';

    protected $fillable = [
        'MatriculeGP',
        'NameGP',
        'DescriptionGp',
        'StatusGP',
        'MatriculeNV',
    ];

    // Relationships

    public function niveau()
    {
        return $this->belongsTo(Niveau::class, 'MatriculeNV', 'MatriculeNV');
    }

    public function etudiants()
    {
        return $this->hasMany(Etudiant::class, 'MatriculeGP', 'MatriculeGP');
    }

    public function regularTimeTables()
    {
        return $this->hasMany(RegularTimeTable::class, 'MatriculeGP', 'MatriculeGP');
    }

    // Required method for GeneratesMatricule trait
    protected static function getMatriculePrefix()
    {
        return 'GP';
    }
}
