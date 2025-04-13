<?php

namespace App\Models;

use App\Traits\GeneratesMatricule;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    use HasFactory, GeneratesMatricule;


    protected $primaryKey = 'matriculeAt';
    public $incrementing = false;
    protected $keyType = 'string';

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'attendances';

    protected $fillable = [
        'matriculeAt',
        'statusAt',
        'isJustifAt',
        'justifAt',
        'DateAt',
        'matriculeUt',
        'matriculeEt',
        'matriculePr',
    ];

    protected $casts = [
        'isJustifAt' => 'boolean',
        'DateAt' => 'date',
    ];

    // Relationships

    public function user()
    {
        return $this->belongsTo(User::class, 'matriculeUt', 'matriculeUt');
    }

    public function etudiant()
    {
        return $this->belongsTo(Etudiant::class, 'matriculeEt', 'matriculeEt')->withDefault();
    }

    public function professeur()
    {
        return $this->belongsTo(Professeur::class, 'matriculePr', 'matriculePr')->withDefault();
    }

    // Required method for GeneratesMatricule trait
    protected static function getMatriculePrefix()
    {
        return 'AT';
    }
}
