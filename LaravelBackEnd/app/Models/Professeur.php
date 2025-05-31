<?php

namespace App\Models;

use App\Traits\GeneratesMatricule;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

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
        'MatriculeYR',
        'CINPR',
        'CivilitePR',
        'DateEmbauchePR',
        'SalairePR',
        'NomBanquePR',
        'RIBPR',
        'MatriculeUT',
        'MatriculeMT',
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

    public function matiere()
    {
        return $this->belongsTo(Matiere::class, 'MatriculeMT', 'MatriculeMT');
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

    public function academicYear()
    {
        return $this->belongsTo(AcademicYear::class, 'MatriculeYR', 'MatriculeYR');
    }
    public function groups(): BelongsToMany
    {
        return $this->belongsToMany(Group::class, 'groups_professeurs', 'MatriculePR', 'MatriculeGP')
                    ->withTimestamps()
                    ->withPivot('MatriculePG');
    }


    // Required method for GeneratesMatricule trait
    protected static function getMatriculePrefix()
    {
        return 'PR';
    }
}
