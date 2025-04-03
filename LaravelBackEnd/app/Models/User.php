<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use App\Traits\GeneratesMatricule;
use Illuminate\Support\Str;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes, GeneratesMatricule;

    public $incrementing = false;
    protected $primaryKey = "matriculeUt";
    protected $keyType = 'string';

    const CREATED_AT = 'created_at';
    const UPDATED_AT = 'updated_at';

    protected $fillable = [
        'matriculeUt',
        'nomUsers',
        'email',
        'phone_number',
        'matricule',
        'role',
        'password',
        'api_token',
        'prenom',
        'date_naissance',
        'sexe',
        'nationalite',
        'lieu_naissance',
        'adresse',
        'code_postal',
        'ville',
        'pays',
        'telephone_fixe',
        'telephone_mobile',
        'contact_urgence_nom',
        'contact_urgence_telephone',
        'contact_urgence_relation',
        'photo',
        'notes',
        'actif'
    ];

    protected $hidden = [
        'password',
        'remember_token',
        'api_token',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'password' => 'hashed',
        'email_verified_at' => 'datetime',
        'date_naissance' => 'date',
        'actif' => 'boolean',
    ];

    /**
     * Generate a new API token for the user.
     */
    public function generateApiToken()
    {
        $token = Str::random(60);
        $this->api_token = $token;
        $this->save();
        return $token;
    }

    /**
     * Get the parent userable model (student or teacher).
     */
    public function userable()
    {
        return $this->morphTo();
    }

    /**
     * Get the student associated with the user.
     */
    public function etudiant()
    {
        return $this->hasOne(Etudiant::class, 'matricule', 'matricule');
    }

    /**
     * Get the teacher associated with the user.
     */
    public function professeur()
    {
        return $this->hasOne(Professeur::class, 'matricule', 'matricule');
    }

    /**
     * تحديد بادئة الرقم التسلسلي للمستخدمين
     *
     * @return string
     */
    protected static function getMatriculePrefix()
    {
        return 'USER';
    }
}
