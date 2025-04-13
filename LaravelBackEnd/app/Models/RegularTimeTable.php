<?php

namespace App\Models;

use App\Traits\GeneratesMatricule;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RegularTimeTable extends Model
{
    use HasFactory, GeneratesMatricule;

    protected $primaryKey = 'matriculeRt';
    public $incrementing = false;
    protected $keyType = 'string';

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'regular_time_tables';

    protected $fillable = [
        'matriculeRt',
        'matriculeDW',
        'matriculeTs',
        'matriculeGp',
        'matriculeMt',
        'matriculePr',
        'matriculeSl',
    ];

    // No casts needed for this model

    // Relationships

    public function dayWeek()
    {
        return $this->belongsTo(DayWeek::class, 'matriculeDW', 'matriculeDW');
    }

    public function timeSlot()
    {
        return $this->belongsTo(TimeSlot::class, 'matriculeTs', 'matriculeTs');
    }

    public function group()
    {
        return $this->belongsTo(Group::class, 'matriculeGp', 'matriculeGp');
    }

    public function matiere()
    {
        return $this->belongsTo(Matiere::class, 'matriculeMt', 'matriculeMt');
    }

    public function professeur()
    {
        return $this->belongsTo(Professeur::class, 'matriculePr', 'matriculePr');
    }

    public function salle()
    {
        return $this->belongsTo(Salle::class, 'matriculeSl', 'matriculeSl');
    }
    // Required method for GeneratesMatricule trait
    protected static function getMatriculePrefix()
    {
        return 'RT';
    }
}
