<?php

namespace App\Models;

use App\Traits\GeneratesMatricule; // Import the trait
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SchoolEvent extends Model
{
    use HasFactory, GeneratesMatricule; // Use the trait

    protected $primaryKey = 'MatriculeSE';
    public $incrementing = false;
    protected $keyType = 'string';

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'school_events';

    // Added fillable
    protected $fillable = [
        'MatriculeSE',
        'NameSE',
        'DescriptionSE',
        'IsFullDaySE',
        'LocationSE',
        'DateSE',
        'MatriculeTS',
    ];

    // Added casts
    protected $casts = [
        'IsFullDaySE' => 'boolean',
        'DateSE' => 'date',
    ];

    // Added relationships
    public function timeSlot()
    {
        return $this->belongsTo(TimeSlot::class, 'MatriculeTS', 'MatriculeTS');
    }

    // Required method for GeneratesMatricule trait
    protected static function getMatriculePrefix()
    {
        return 'SE';
    }
}
