<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index()
    {
        return response()->json(User::all());
    }

    public function store(Request $request)
    {
        $request->validate([
            'matriculeUt' => 'required|string|unique:users',
            'nomUt' => 'required|string|unique:users',
            'passwordUt' => 'required|string|min:8',
            'roleUt' => 'required|in:etudiant,professeur,admin',
        ]);

        $user = User::create([
            'matriculeUt' => $request->matriculeUt,
            'nomUt' => $request->nomUt,
            'passwordUt' => Hash::make($request->passwordUt),
            'roleUt' => $request->roleUt,
        ]);

        return response()->json(['message' => 'User created successfully', 'user' => $user], 201);
    }

    public function show($matriculeUt)
    {
        $user = User::findOrFail($matriculeUt);
        return response()->json($user);
    }

    public function count()
    {
        $count = User::count();
        return response()->json(['count' => $count]);
    }

    public function update(Request $request, $matriculeUt)
    {
        $user = User::findOrFail($matriculeUt);

        $request->validate([
            'nomUt' => 'nullable|string|unique:users',
            'passwordUt' => 'nullable|string|min:8',
            'roleUt' => 'nullable|in:etudiant,professeur,admin',
        ]);

        $user->update([
            'nomUt' => $request->nomUt ?? $user->nomUt,
            'passwordUt' => $request->passwordUt ? Hash::make($request->passwordUt) : $user->passwordUt,
            'roleUt' => $request->roleUt ?? $user->roleUt,
        ]);

        return response()->json(['message' => 'User updated successfully', 'user' => $user]);
    }

    public function destroy($matriculeUt)
    {
        $user = User::findOrFail($matriculeUt);
        $user->delete();

        return response()->json(['message' => 'User deleted successfully']);
    }
}
