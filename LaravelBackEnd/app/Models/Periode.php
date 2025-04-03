<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use App\Traits\GeneratesMatricule;

class Periode extends Model
{
    use HasFactory, Notifiable, GeneratesMatricule;

    public $incrementing = false;
    protected $primaryKey = "matriculePer";
    protected $keyType = 'string';

    const CREATED_AT = 'created_at';
    const UPDATED_AT = 'updated_at';

    protected $fillable = [
        'matriculePer', 'NOMper', 'DATE_DEBUTper', 'DATE_FINper',
        'DESCRIPTIONper', 'STATUTper'
    ];

    protected $casts = [
        'DATE_DEBUTper' => 'datetime',
        'DATE_FINper' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    /**
     * تحديد بادئة الرقم التسلسلي للفترات
     *
     * @return string
     */
    protected static function getMatriculePrefix()
    {
        return 'PER';
    }

    public function emploisDuTemps()
    {
        return $this->hasMany(EmploiDuTemps::class, 'matriculePer');
    }
} 