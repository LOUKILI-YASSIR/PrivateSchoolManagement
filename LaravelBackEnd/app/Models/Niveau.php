<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use App\Traits\GeneratesMatricule;

class Niveau extends Model
{
    use HasFactory, Notifiable, GeneratesMatricule;

    public $incrementing = false;
    protected $primaryKey = "matriculeNiv";
    protected $keyType = 'string';

    const CREATED_AT = 'created_at';
    const UPDATED_AT = 'updated_at';

    protected $fillable = [
        'matriculeNiv', 'LIBELLEniv', 'DESCRIPTIONniv', 'ORDREniv', 'STATUTniv'
    ];

    protected $casts = [
        'ORDREniv' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    /**
     * تحديد بادئة الرقم التسلسلي للمستويات
     *
     * @return string
     */
    protected static function getMatriculePrefix()
    {
        return 'NIV';
    }

    public function groupes()
    {
        return $this->hasMany(Groupe::class, 'matriculeNiv');
    }

    public function inscriptions()
    {
        return $this->hasMany(InscriptionEtudiant::class, 'matriculeNiv');
    }
} 