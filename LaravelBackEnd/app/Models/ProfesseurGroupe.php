<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use App\Traits\GeneratesMatricule;

class ProfesseurGroupe extends Model
{
    use HasFactory, Notifiable, GeneratesMatricule;

    public $incrementing = false;
    protected $primaryKey = "matriculePrGrp";
    protected $keyType = 'string';

    const CREATED_AT = 'created_at';
    const UPDATED_AT = 'updated_at';

    protected $fillable = [
        'matriculePrGrp', 'matriculePR', 'matriculeGrp', 'DATE_AFFECTATIONprgrp',
        'STATUTprgrp', 'OBSERVATIONprgrp'
    ];

    protected $casts = [
        'DATE_AFFECTATIONprgrp' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    /**
     * تحديد بادئة الرقم التسلسلي لعلاقات الأساتذة بالمجموعات
     *
     * @return string
     */
    protected static function getMatriculePrefix()
    {
        return 'PRGRP';
    }

    public function professeur()
    {
        return $this->belongsTo(Professeur::class, 'matriculePR');
    }

    public function groupe()
    {
        return $this->belongsTo(Groupe::class, 'matriculeGrp');
    }
} 