<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use App\Traits\GeneratesMatricule;

class Etudiant extends Model
{
    use HasFactory, Notifiable, GeneratesMatricule;

    public $incrementing = false; // منع التزايد التلقائي لأن المفتاح الأساسي نصي
    protected $primaryKey = "matriculeEt"; // المفتاح الأساسي
    protected $keyType = 'string'; // نوع المفتاح الأساسي نصي

    const CREATED_AT = 'created_at';
    const UPDATED_AT = 'updated_at';

    protected $fillable = [
        'matriculeEt', 'GENREEt', 'NOMEt', 'PRENOMEt', 'LIEU_NAISSANCEEt', 'DATE_NAISSANCEEt',
        'NATIONALITEEt', 'ADRESSEEt', 'VILLEEt', 'PAYSEt', 'CODE_POSTALEt', 'EMAILEt',
        'PROFILE_PICTUREEt', 'OBSERVATIONEt', 'LIEN_PARENTETr', 'NOMTr', 'PRENOMTr', 'PROFESSIONTr',
        'TELEPHONE1Tr', 'TELEPHONE2Tr', 'EMAILTr', 'OBSERVATIONTr', 'user_id'
    ];

    protected $casts = [
        'matriculeEt' => 'string',
        'GENREEt' => 'string',
        'NOMEt' => 'string',
        'PRENOMEt' => 'string',
        'LIEU_NAISSANCEEt' => 'string',
        'DATE_NAISSANCEEt' => 'date',
        'NATIONALITEEt' => 'string',
        'ADRESSEEt' => 'string',
        'VILLEEt' => 'string',
        'PAYSEt' => 'string',
        'CODE_POSTALEt' => 'string',
        'EMAILEt' => 'string',
        'PROFILE_PICTUREEt' => 'string',
        'OBSERVATIONEt' => 'string',
        'LIEN_PARENTETr' => 'string',
        'NOMTr' => 'string',
        'PRENOMTr' => 'string',
        'PROFESSIONTr' => 'string',
        'TELEPHONE1Tr' => 'string',
        'TELEPHONE2Tr' => 'string',
        'EMAILTr' => 'string',
        'OBSERVATIONTr' => 'string',
        'user_id' => 'string',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the user associated with the student.
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Get the student's inscriptions.
     */
    public function inscriptions()
    {
        return $this->hasMany(InscriptionEtudiant::class, 'matriculeEt');
    }

    /**
     * تحديد بادئة الرقم التسلسلي للطلاب
     *
     * @return string
     */
    protected static function getMatriculePrefix()
    {
        return 'ET'; // يمكن تغييره إذا كنت تستخدم نفس الـ Trait لنماذج أخرى
    }
}
