<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use App\Traits\GeneratesMatricule;

class Groupe extends Model
{
    use HasFactory, Notifiable, GeneratesMatricule;

    public $incrementing = false;
    protected $primaryKey = "matriculeGrp";
    protected $keyType = 'string';

    const CREATED_AT = 'created_at';
    const UPDATED_AT = 'updated_at';

    protected $fillable = [
        'matriculeGrp', 'NOMgrp', 'CAPACITEgrp', 'DESCRIPTIONgrp', 'STATUTgrp',
        'matriculeNiv', 'matriculeSect', 'matriculeInst'
    ];

    protected $casts = [
        'CAPACITEgrp' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    /**
     * تحديد بادئة الرقم التسلسلي للمجموعات
     *
     * @return string
     */
    protected static function getMatriculePrefix()
    {
        return 'GRP';
    }

    public function niveau()
    {
        return $this->belongsTo(Niveau::class, 'matriculeNiv');
    }

    public function section()
    {
        return $this->belongsTo(Section::class, 'matriculeSect');
    }

    public function institution()
    {
        return $this->belongsTo(Institution::class, 'matriculeInst');
    }

    public function professeurs()
    {
        return $this->belongsToMany(Professeur::class, 'professeur_groupes', 'matriculeGrp', 'matriculePr');
    }

    public function etudiants()
    {
        return $this->hasMany(InscriptionEtudiant::class, 'matriculeGrp');
    }

    public function emploisDuTemps()
    {
        return $this->hasMany(EmploiDuTemps::class, 'matriculeGrp');
    }
} 