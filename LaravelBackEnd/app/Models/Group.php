<?php

namespace App\Models;

use App\Traits\GeneratesMatricule;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Group extends Model
{
    use HasFactory, GeneratesMatricule;

    protected $primaryKey = 'matriculeGp';
    public $incrementing = false;
    protected $keyType = 'string';

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'groups';

    protected $fillable = [
        'matriculeGp',
        'NameGp',
        'descriptionGp',
        'statusGp',
        'matriculeNv',
    ];

    // Relationships

    public function niveau()
    {
        return $this->belongsTo(Niveau::class, 'matriculeNv', 'matriculeNv');
    }

    public function etudiants()
    {
        return $this->hasMany(Etudiant::class, 'matriculeGp', 'matriculeGp');
    }

    public function regularTimeTables()
    {
        return $this->hasMany(RegularTimeTable::class, 'matriculeGp', 'matriculeGp');
    }

    // Required method for GeneratesMatricule trait
    protected static function getMatriculePrefix()
    {
        return 'GP';
    }
}
