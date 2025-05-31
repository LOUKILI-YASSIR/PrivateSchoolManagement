<?php

namespace App\Models;

use App\Traits\GeneratesMatricule;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Salle extends Model
{
    use HasFactory, GeneratesMatricule;

    protected $primaryKey = 'MatriculeSL';
    public $incrementing = false;
    protected $keyType = 'string';

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'salles';

    protected $fillable = [
        'MatriculeSL',
        'NameSL',
        'CapacitySL',
        'LocationSL',
        'RessourcesSL',
        'TypeSL',
        'StatusSL',
        'FloorSL',
        'ObservationSL',
        'MatriculeYR', // Foreign key to yer_matricules table
    ];

    protected $casts = [
        'CapacitySL' => 'integer',
    ];

    // Relationships

    public function regularTimeTables()
    {
        return $this->hasMany(RegularTimeTable::class, 'MatriculeSL', 'MatriculeSL');
    }
    public function academic_year()
    {
        return $this->belongsTo(AcademicYear::class, 'MatriculeYR', 'MatriculeYR');
    }
    // Required method for GeneratesMatricule trait
    protected static function getMatriculePrefix()
    {
        return 'SL';
    }
}
