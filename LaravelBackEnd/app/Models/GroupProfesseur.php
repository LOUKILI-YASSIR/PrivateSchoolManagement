<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Casts\Attribute;

class GroupProfesseur extends Pivot
{
    // إذا لم تستخدم "Pivot" في Laravel 8 أو أقل، استخدم Model
    protected $table = 'groups_professeurs';

    protected $primaryKey = 'MatriculePG';
    public $incrementing = false; // لأن المفتاح ليس رقميًا
    protected $keyType = 'string';

    protected $fillable = [
        'MatriculePG',
        'MatriculePR',
        'MatriculeGP',
    ];

    public $timestamps = true;

    // العلاقات
    public function professeur()
    {
        return $this->belongsTo(Professeur::class, 'MatriculePR');
    }

    public function group()
    {
        return $this->belongsTo(Group::class, 'MatriculeGP');
    }
        protected static function getMatriculePrefix()
    {
        return 'PG';
    }
}
