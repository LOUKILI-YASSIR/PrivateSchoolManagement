<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use \App\Traits\GeneratesMatricule;

class Matiere extends Model
{
    use HasFactory, Notifiable, GeneratesMatricule;
    public $incrementing = false; // Disable auto-incrementing for primary key
    protected $keyType = 'string'; // Set primary key type to string
    protected $primaryKey = 'matriculeMat'; // Primary key (auto-incrementing integer)

    // Table name (optional, Laravel infers 'matieres' by default, but 'matiere' is specified in migration)
    protected $table = 'matiere';

    // Fillable fields for mass assignment, excluding 'id', 'created_at', and 'updated_at'
    protected $fillable = [
        'matriculeMat',
        'name',
        'description',
        'coefficient',
        'num_controls',
        'has_final_exam',
        'has_other_grade',
        'has_monitoring_behavior_grade',
    ];

    // Casts for proper data type handling in PHP
    protected $casts = [
        'matriculeMat' => 'string',
        'name' => 'string',
        'description' => 'string',
        'coefficient' => 'integer',
        'num_controls' => 'integer',
        'has_final_exam' => 'boolean',
        'has_other_grade' => 'boolean',
        'has_monitoring_behavior_grade' => 'boolean',
    ];

    /**
     * Relationship with Professeur (many-to-many)
     * Assumes pivot table 'affectation_professeurs' uses 'matriculeMat' as foreign key
     */
    public function professeurs()
    {
        return $this->belongsToMany(Professeur::class, 'affectation_professeurs', 'matriculeMat', 'matriculePr');
    }

    /**
     * Relationship with Evaluation (one-to-many)
     * Assumes 'evaluations' table has 'matriculeMat' foreign key
     */
    public function evaluations()
    {
        return $this->hasMany(Evaluation::class, 'matriculeMat');
    }

    /**
     * Relationship with EmploiDuTemps (one-to-many)
     * Assumes 'emploi_du_temps' table has 'matriculeMat' foreign key
     */
    public function emploisDuTemps()
    {
        return $this->hasMany(EmploiDuTemps::class, 'matriculeMat');
    }

    /**
     * Summary of getMatriculePrefix
     * @return string
     */
    protected static function getMatriculePrefix()
    {
        return 'Mat';
    }
}
