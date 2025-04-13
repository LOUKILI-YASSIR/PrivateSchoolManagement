<?php

namespace App\Models;

use App\Traits\GeneratesMatricule;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Salle extends Model
{
    use HasFactory, GeneratesMatricule;

    protected $primaryKey = 'matriculeSl';
    public $incrementing = false;
    protected $keyType = 'string';

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'salles';

    protected $fillable = [
        'matriculeSl',
        'NameSl',
        'CapacitySl',
        'LocationSl',
        'ressourcesSl',
        'typeSl',
        'statusSl',
        'floorSl',
        'observationSl',
    ];

    protected $casts = [
        'CapacitySl' => 'integer',
    ];

    // Relationships

    public function regularTimeTables()
    {
        return $this->hasMany(RegularTimeTable::class, 'matriculeSl', 'matriculeSl');
    }

    // Required method for GeneratesMatricule trait
    protected static function getMatriculePrefix()
    {
        return 'SL';
    }
}
