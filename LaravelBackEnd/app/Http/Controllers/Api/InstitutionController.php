<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Institution;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class InstitutionController extends Controller
{
    public function index()
    {
        $institutions = Institution::all();
        return response()->json($institutions);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nomInst' => 'required|string|max:100',
            'dateDebut' => 'required|date',
            'dateFin' => 'required|date|after:dateDebut',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $institution = Institution::create($request->all());
        return response()->json($institution, 201);
    }

    public function show(Institution $institution)
    {
        return response()->json($institution);
    }

    public function update(Request $request, Institution $institution)
    {
        $validator = Validator::make($request->all(), [
            'nomInst' => 'required|string|max:100',
            'dateDebut' => 'required|date',
            'dateFin' => 'required|date|after:dateDebut',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $institution->update($request->all());
        return response()->json($institution);
    }

    public function destroy(Institution $institution)
    {
        $institution->delete();
        return response()->json(null, 204);
    }
} 