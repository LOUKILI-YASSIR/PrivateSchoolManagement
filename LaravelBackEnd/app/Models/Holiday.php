<?php

namespace App\Models;

use App\Traits\GeneratesMatricule;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Holiday extends Model
{
    use HasFactory, GeneratesMatricule;

    protected $primaryKey = 'matriculeHd';
    public $incrementing = false;
    protected $keyType = 'string';

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'holidays';

    protected $fillable = [
        'matriculeHd',
        'startdateHd',
        'endDateHd',
        'nameHd',
        'descriptionHd',
        'matriculeYR',
    ];

    protected $casts = [
        'startdateHd' => 'date',
        'endDateHd' => 'date',
    ];

    // Relationships

    public function academicYear()
    {
        return $this->belongsTo(AcademicYear::class, 'matriculeYR', 'matriculeYR');
    }

    // Required method for GeneratesMatricule trait
    protected static function getMatriculePrefix()
    {
        return 'HD';
    }
}
