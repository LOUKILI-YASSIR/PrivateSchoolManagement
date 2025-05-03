<?php

namespace App\Models;

use App\Traits\GeneratesMatricule;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DayWeek extends Model
{
    use HasFactory, GeneratesMatricule;

    protected $primaryKey = 'MatriculeDW';
    public $incrementing = false;
    protected $keyType = 'string';

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'day_weeks';

    protected $fillable = [
        'MatriculeDW',
        'DayNameDW',
    ];

    // No casts needed for this model

    // Relationships

    public function regularTimeTables()
    {
        return $this->hasMany(RegularTimeTable::class, 'MatriculeDW', 'MatriculeDW');
    }

    // Required method for GeneratesMatricule trait
    protected static function getMatriculePrefix()
    {
        return 'DW';
    }
}
