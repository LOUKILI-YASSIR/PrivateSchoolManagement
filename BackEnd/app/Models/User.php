<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $table = 'users';
    protected $primaryKey = 'matriculeUt';
    public $incrementing = false; // Because primary key is not auto-incremented
    protected $keyType = 'string';

    protected $fillable = [
        'matriculeUt',
        'nomUt',
        'passwordUt',
        'roleUt',
    ];

    protected $hidden = [
        'passwordUt',
        'remember_token',
    ];
}
