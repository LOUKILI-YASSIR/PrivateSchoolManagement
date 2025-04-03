<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use App\Traits\GeneratesMatricule;

class Salle extends Model
{
    use HasFactory, Notifiable, GeneratesMatricule;

    public $incrementing = false;
    protected $primaryKey = "matriculeSalle";
    protected $keyType = 'string';

    const CREATED_AT = 'created_at';
    const UPDATED_AT = 'updated_at';

    protected $fillable = [
        'matriculeSalle', 'NOMsalle', 'CAPACITEsalle', 'DESCRIPTIONsalle',
        'ETAGEsalle', 'BLOCsalle', 'STATUTsalle', 'matriculeInst'
    ];

    protected $casts = [
        'CAPACITEsalle' => 'integer',
        'ETAGEsalle' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    /**
     * تحديد بادئة الرقم التسلسلي للقاعات
     *
     * @return string
     */
    protected static function getMatriculePrefix()
    {
        return 'SALLE';
    }

    public function institution()
    {
        return $this->belongsTo(Institution::class, 'matriculeInst');
    }

    public function emploisDuTemps()
    {
        return $this->hasMany(EmploiDuTemps::class, 'matriculeSalle');
    }
} 