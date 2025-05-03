<?php

namespace App\Models;

use App\Traits\GeneratesMatricule;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Holiday extends Model
{
    use HasFactory, GeneratesMatricule;

    protected $primaryKey = 'MatriculeHD';
    public $incrementing = false;
    protected $keyType = 'string';

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'holidays';

    protected $fillable = [
        'MatriculeHD',
        'StartDateHD',
        'EndDateHD',
        'NameHD',
        'DescriptionHD',
        'MatriculeYR',
    ];

    protected $casts = [
        'StartDateHD' => 'date',
        'EndDateHD' => 'date',
    ];

    // Relationships

    public function academicYear()
    {
        return $this->belongsTo(AcademicYear::class, 'MatriculeYR', 'MatriculeYR');
    }

    // Required method for GeneratesMatricule trait
    protected static function getMatriculePrefix()
    {
        return 'HD';
    }
}
