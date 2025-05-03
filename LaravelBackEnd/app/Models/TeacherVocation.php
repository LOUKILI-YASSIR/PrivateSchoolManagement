<?php

namespace App\Models;

use App\Traits\GeneratesMatricule;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TeacherVocation extends Model
{
    use HasFactory, GeneratesMatricule;

    protected $primaryKey = 'MatriculeTV';
    public $incrementing = false;
    protected $keyType = 'string';

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'teacher_vocations';

    protected $fillable = [
        'MatriculeTV',
        'MatriculePR',
        'StartDateTV',
        'ApprovedTV',
        'EndDateTV',
    ];

    protected $casts = [
        'StartDateTV' => 'date',
        'ApprovedTV' => 'boolean',
        'EndDateTV' => 'date',
    ];

    // Relationships

    public function professeur()
    {
        return $this->belongsTo(Professeur::class, 'MatriculePR', 'MatriculePR');
    }

    // Required method for GeneratesMatricule trait
    protected static function getMatriculePrefix()
    {
        return 'TV';
    }
}
