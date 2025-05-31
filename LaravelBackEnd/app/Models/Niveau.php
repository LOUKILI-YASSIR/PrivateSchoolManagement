<?php

namespace App\Models;

use App\Traits\GeneratesMatricule;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Niveau extends Model
{
    use HasFactory, GeneratesMatricule;

    protected $primaryKey = 'MatriculeNV';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $table = 'niveaux';

    protected $fillable = [
        'MatriculeNV',
        'CodeNV',
        'NomNV',
        'DescriptionNV',
        'MatriculeYR', // Foreign key to academic_years table
    ];

    // Relations
    public function matieres()
    {
        return $this->hasMany(Matiere::class, 'MatriculeNV', 'MatriculeNV');
    }

    public function groups()
    {
        return $this->hasMany(Group::class, 'MatriculeNV', 'MatriculeNV');
    }
        public function academicYear()
    {
        return $this->belongsTo(AcademicYear::class, 'MatriculeYR', 'MatriculeYR');
    }
public static function generateMatricule($year = null)
{
    // إذا لم يتم تمرير السنة، نستخدم السنة الحالية
    $year = $year ?? date('Y');

    // عدّ عدد المستويات في هذه السنة
    $count = self::whereYear('created_at', $year)->count();

    // زيادة العداد + تنسيقه ليكون 6 أرقام (مثل 000001)
    $formattedCount = str_pad($count + 1, 6, '0', STR_PAD_LEFT);

    // إرجاع الماتريكول بالشكل المطلوب
    return "YLSchool_{$year}_NV_{$formattedCount}";
}

    protected static function getMatriculePrefix()
    {
        return 'NV';
    }
}
