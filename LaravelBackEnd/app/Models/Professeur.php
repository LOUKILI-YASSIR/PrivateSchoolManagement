<?php

namespace App\Models;

use App\Traits\GeneratesMatricule;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Professeur extends Model
{
    use HasFactory, GeneratesMatricule;

    protected $primaryKey = 'MatriculePR';
    public $incrementing = false;
    protected $keyType = 'string';

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'professeurs';

    protected $fillable = [
        'MatriculePR',
        'CINPR',
        'CivilitePR',
        'Phone1PR',
        'Phone2PR',
        'DateEmbauchePR',
        'SalairePR',
        'NomBanquePR',
        'RIBPR',
        'MatriculeUT',
    ];

    protected $casts = [
        'DateEmbauchePR' => 'date',
        'SalairePR' => 'float',
    ];

    // Relationships

    public function user()
    {
        return $this->belongsTo(User::class, 'MatriculeUT', 'MatriculeUT');
    }

    public function matieres()
    {
        return $this->hasMany(Matiere::class, 'MatriculePR', 'MatriculePR');
    }

    public function attendances()
    {
        return $this->hasMany(Attendance::class, 'MatriculePR', 'MatriculePR');
    }

    public function teacherVocations()
    {
        return $this->hasMany(TeacherVocation::class, 'MatriculePR', 'MatriculePR');
    }

    public function regularTimeTables()
    {
        return $this->hasMany(RegularTimeTable::class, 'MatriculePR', 'MatriculePR');
    }

    // Required method for GeneratesMatricule trait
    protected static function getMatriculePrefix()
    {
        return 'PR';
    }
}
