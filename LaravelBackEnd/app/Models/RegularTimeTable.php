<?php

namespace App\Models;

use App\Traits\GeneratesMatricule;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RegularTimeTable extends Model
{
    use HasFactory, GeneratesMatricule;

    protected $primaryKey = 'MatriculeRT';
    public $incrementing = false;
    protected $keyType = 'string';

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'regular_time_tables';

    protected $fillable = [
        'MatriculeRT',
        'MatriculeDW',
        'MatriculeTS',
        'MatriculeGP',
        'MatriculeMT',
        'MatriculePR',
        'MatriculeSL',
    ];

    // No casts needed for this model

    // Relationships

    public function dayWeek()
    {
        return $this->belongsTo(DayWeek::class, 'MatriculeDW', 'MatriculeDW');
    }

    public function timeSlot()
    {
        return $this->belongsTo(TimeSlot::class, 'MatriculeTS', 'MatriculeTS');
    }

    public function group()
    {
        return $this->belongsTo(Group::class, 'MatriculeGP', 'MatriculeGP');
    }

    public function matiere()
    {
        return $this->belongsTo(Matiere::class, 'MatriculeMT', 'MatriculeMT');
    }

    public function professeur()
    {
        return $this->belongsTo(Professeur::class, 'MatriculePR', 'MatriculePR');
    }

    public function salle()
    {
        return $this->belongsTo(Salle::class, 'MatriculeSL', 'MatriculeSL');
    }
    // Required method for GeneratesMatricule trait
    protected static function getMatriculePrefix()
    {
        return 'RT';
    }
}
