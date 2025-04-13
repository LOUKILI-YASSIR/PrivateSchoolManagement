<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use App\Traits\GeneratesMatricule;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, GeneratesMatricule;

    protected $primaryKey = 'matriculeUt';
    public $incrementing = false;
    protected $keyType = 'string';

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'users';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'matriculeUt',
        'usernameUt',
        'emailUt',
        'phoneUt',
        'roleUt',
        'passwordUt',
        'statutUt',
        'NomPl',
        'PrenomPl',
        'genrePl',
        'adressPl',
        'villePl',
        'codePostalPl',
        'paysPl',
        'nationalitePl',
        'lieuNaissancePl',
        'dateNaissancePl',
        'ObservationPl',
        'profileFileNamePl',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'passwordUt',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime', // Default Laravel cast
        'dateNaissancePl' => 'date',
        'passwordUt' => 'hashed', // Use the 'hashed' cast for automatic hashing
    ];

    // Relationships

    public function professeur()
    {
        return $this->hasOne(Professeur::class, 'matriculeUt', 'matriculeUt');
    }

    public function etudiant()
    {
        return $this->hasOne(Etudiant::class, 'matriculeUt', 'matriculeUt');
    }

    public function attendances()
    {
        return $this->hasMany(Attendance::class, 'matriculeUt', 'matriculeUt');
    }

    public function academicYears()
    {
        return $this->hasMany(AcademicYear::class, 'matriculeUt', 'matriculeUt');
    }

    // Required method for GeneratesMatricule trait
    protected static function getMatriculePrefix()
    {
        return 'UT';
    }
}
