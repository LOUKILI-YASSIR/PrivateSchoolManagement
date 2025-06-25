<?php

namespace App\Http\Controllers;

use App\Models\Professeur;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Str;
class UserController extends Controller
{
    public function getGroupFromUserId($studentId = null){
        $user = User::where("MatriculeUT",$studentId)->first();
        if ($user->RoleUT === "etudiant") return User::with("etudiant.group")->where("MatriculeUT",$studentId)->first()?->etudiant?->group?->MatriculeGP ?? "";
        else  return Professeur::where("MatriculeUT",$studentId)->first()->MatriculePR;
    }
    public function getFromUser(){
        return [
            "emails" => User::pluck("EmailUT")->toArray(),
            "noms"  => User::pluck("NomPL")->toArray(),
            "prenoms"  => User::pluck("PrenomPL")->toArray(),
            "usernames"  => User::pluck("UserNameUT")->toArray(),
            "phones"      => User::pluck("PhoneUT")->toArray(),
        ];
    }
  

public function updateUserInfo(Request $request,$MatriculeUT = null)
{
    $user = User::where("MatriculeUT",$MatriculeUT)->first();

    if (!$user) {
        return response()->json(['message' => 'Utilisateur non authentifié ou introuvable.'], 401);
    }

    $rules = [
        'UserNameUT' => 'required|string|max:255|unique:users,UserNameUT,' . $user->MatriculeUT . ',MatriculeUT',
        'EmailUT' => 'required|email|max:255|unique:users,EmailUT,' . $user->MatriculeUT . ',MatriculeUT',
        'PhoneUT' => 'nullable|string|max:20',
        'NomPL' => 'nullable|string|max:255',
        'PrenomPL' => 'nullable|string|max:255',
        'GenrePL' => 'nullable|in:Homme,Femelle',
        'AdressPL' => 'nullable|string|max:255',
        'VillePL' => 'nullable|string|max:100',
        'CodePostalPL' => 'nullable|string|max:20',
        'PaysPL' => 'nullable|string|max:100',
        'NationalitePL' => 'nullable|string|max:100',
        'LieuNaissancePL' => 'nullable|string|max:100',
        'DateNaissancePL' => 'nullable|date',
        'ObservationPL' => 'nullable|string',
        'LanguagePageUT' => 'nullable|string|in:fr,en,es,de',
        'ThemePageUT' => 'nullable|string|in:light,dark',
        'ProfileFileNamePL' => 'nullable|string|max:255',
    ];

    if ($request->filled('PasswordUT')) {
        $rules['OldPasswordUT'] = ['required', function ($attribute, $value, $fail) use ($user) {
            if (!Hash::check($value, $user->PasswordUT)) {
                $fail("L'ancien mot de passe est incorrect.");
            }
        }];

        $rules['PasswordUT'] = [
            'required',
            'string',
            'min:8',
            'regex:/[a-z]/',
            'regex:/[A-Z]/',
            'regex:/[0-9]/',
            'regex:/[@$!%*#?&]/',
            'confirmed'
        ];

        $rules['PasswordUT_confirmation'] = 'required|string';
    }

    $validated = $request->validate($rules);

    // ✅ تحديث البيانات العامة
    $user->fill($validated);

    // إعداد المتغيرات للإرجاع
    $username = $validated['UserNameUT'] ?? $user->UserNameUT;
    $EmailUT = $validated['EmailUT'] ?? $user->EmailUT;
    $PhoneUT = $validated['PhoneUT'] ?? $user->PhoneUT;
    $password = null;
    $validationCode = null;

    // ✅ إذا تم تغيير كلمة المرور
    if ($request->filled('PasswordUT')) {
        $user->PasswordUT = Hash::make($request->PasswordUT);

        // إنشاء كود تحقق جديد
        $plainCode = Str::random(27);
        $encryptedCode = Crypt::encryptString($plainCode);
        $user->CodeVerificationUT = $encryptedCode;

        $password = $request->PasswordUT;
        $validationCode = $plainCode;
    }

    $user->save();

    // ✅ تجهيز نتيجة الإرجاع
    $result = [
        "user" => $user,
        "userInfo" => [
            "username" => $username,
            "password" => $password,
            "validationCode" => $validationCode,
            'EmailUT' => $EmailUT,
            'PhoneUT' => $PhoneUT,
        ]
    ];

    return [
        "formattedData" => $result,
        "message" => "Informations utilisateur mises à jour avec succès.",
        "status" => "success",
        "code" => 200
    ];
    }

}
