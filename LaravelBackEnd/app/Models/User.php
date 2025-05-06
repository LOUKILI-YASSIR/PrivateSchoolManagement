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

    protected $primaryKey = 'MatriculeUT';
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
        'MatriculeUT',
        'UserNameUT',
        'EmailUT',
        'PhoneUT',
        'must_change_password',
        'last_login_at',
        'LanguagePageUT',
        'ThemePageUT',
        'CodeVerificationUT',
        'google2fa_secret',
        'GoogleSecretUT',
        'google2fa_enabled',
        'google2fa_enabled_at',
        'RoleUT',
        'PasswordUT',
        'StatutUT',
        'NomPL',
        'PrenomPL',
        'GenrePL',
        'AdressPL',
        'VillePL',
        'CodePostalPL',
        'PaysPL',
        'NationalitePL',
        'LieuNaissancePL',
        'DateNaissancePL',
        'ObservationPL',
        'ProfileFileNamePL',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'PasswordUt',
        'remember_token',
        'google2fa_secret',
        'GoogleSecretUT',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'DateNaissancePL' => 'date',
        'PasswordUT' => 'hashed', // Use the 'hashed' cast for automatic hashing
        'google2fa_enabled' => 'boolean',
        'google2fa_enabled_at' => 'datetime',
    ];

    // Relationships

    public function professeur()
    {
        return $this->hasOne(Professeur::class, 'MatriculeUT', 'MatriculeUT');
    }

    public function etudiant()
    {
        return $this->hasOne(Etudiant::class, 'MatriculeUT', 'MatriculeUT');
    }

    public function attendances()
    {
        return $this->hasMany(Attendance::class, 'MatriculeUT', 'MatriculeUT');
    }

    public function academicYears()
    {
        return $this->hasMany(AcademicYear::class, 'MatriculeUT', 'MatriculeUT');
    }

    // Required method for GeneratesMatricule trait
    protected static function getMatriculePrefix()
    {
        return 'UT';
    }
}
