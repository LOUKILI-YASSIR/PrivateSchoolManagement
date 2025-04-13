<?php

namespace App\Models;

use App\Traits\GeneratesMatricule; // Import the trait
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SchoolEvent extends Model
{
    use HasFactory, GeneratesMatricule; // Use the trait

    protected $primaryKey = 'matriculeSe';
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
        'matriculeSe',
        'nameSe',
        'descriptionSe',
        'isFulldaySe',
        'locationSe',
        'dateSe',
        'matriculeTs',
    ];

    // Added casts
    protected $casts = [
        'isFulldaySe' => 'boolean',
        'dateSe' => 'date',
    ];

    // Added relationships
    public function timeSlot()
    {
        return $this->belongsTo(TimeSlot::class, 'matriculeTs', 'matriculeTs');
    }

    // Required method for GeneratesMatricule trait
    protected static function getMatriculePrefix()
    {
        return 'SE';
    }
}
