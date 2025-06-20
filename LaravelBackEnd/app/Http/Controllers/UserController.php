<?php

namespace App\Http\Controllers;

use App\Models\Professeur;
use Illuminate\Http\Request;
use App\Models\User;

class UserController extends Controller
{
    public function getGroupFromUserId($studentId = null){
        $user = User::where("MatriculeUT",$studentId)->first();
        if ($user->RoleUT === "etudiant") return User::with("etudiant.group")->where("MatriculeUT",$studentId)->first()?->etudiant?->group?->MatriculeGP ?? "";
        else  return Professeur::where("MatriculeUT",$studentId)->first()->MatriculePR;
    }
}
