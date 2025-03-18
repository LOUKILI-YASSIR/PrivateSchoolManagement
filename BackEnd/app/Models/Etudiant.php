<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;

class Etudiant extends Model
{
    use HasFactory, Notifiable;
    public $incrementing=false;
    protected $primaryKey="matriculeEt";
    protected $keyType = 'string';
    const CREATED_AT = 'created_at';
    const UPDATED_AT = 'updated_at';
    protected $fillable = [
            'matriculeEt','GENREEt','NOMEt','PRENOMEt','LIEU_NAISSANCEEt','DATE_NAISSANCEEt',
            'NATIONALITEEt','ADRESSEEt','VILLEEt','PAYSEt','CODE_POSTALEt','EMAILEt',
            'PROFILE_PICTUREEt','OBSERVATIONEt','LIEN_PARENTETr','NOMTr','PRENOMTr','PROFESSIONTr',
            'TELEPHONE1Tr','TELEPHONE2Tr','EMAILTr','OBSERVATIONTr'
    ];
    protected $hidden = [

    ];
    protected static function boot(){
        parent::boot();
        static::creating(
            function($etudiant){
                $dernieEtudiant=$etudiant::latest("matriculeEt")->first();
                $nouvelId=$dernieEtudiant ? (int) substr($dernieEtudiant->matriculeEt,-5)+1:1;
                $etudiant->matriculeEt="YLSCHOOL_ET_".date("Y")."_".str_pad($nouvelId,5,"0",STR_PAD_LEFT);
            }
        );
    }
}
