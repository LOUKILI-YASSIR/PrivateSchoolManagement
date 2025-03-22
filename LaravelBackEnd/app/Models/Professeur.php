<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Professeur extends Model
{
    use HasFactory;
    public $incrementing=false;
    protected $primaryKey="matriculePr";
    protected $keyType = 'string';
    const CREATED_AT = 'created_at';
    const UPDATED_AT = 'updated_at';
    protected $fillable = [
        'image_urlPr','civilitePr','nomPr','prenomPr','nationalitePr','CINPr','DateNaissancePr',
        'adressePr','villePr','CodePostalPr','paysPr','emailPr','Telephone1Pr','matriculePr',
        'Telephone2Pr','dateEmbauchePr','salairePr','NomBanquePr','RIBPr','observationPr',
    ];
    protected static function boot(){
        parent::boot();
        static::creating(
            function($professeur){
                $dernieProfesseur=$professeur::latest("matriculePr")->first();
                $nouvelId=$dernieProfesseur ? (int) substr($dernieProfesseur->matriculePr,-3)+1:1;
                $professeur->matriculePr="YLSCHOOL_PR_".date("Y")."_".str_pad($nouvelId,3,"0",STR_PAD_LEFT);
            }
        );
    }
}
