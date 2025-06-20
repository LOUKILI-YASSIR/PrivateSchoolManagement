<?php

namespace App\Http\Controllers\API;
use App\Models\Evaluation;
use App\Models\EvaluationResult;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Traits\CrudOperations;
use App\Models\EvaluationType;
use App\Models\User;
use Illuminate\Support\Facades\Log;

class EvaluationTypeController extends Controller
{
    use CrudOperations;

    protected string $model = EvaluationType::class;

    protected array $validationRules = [
        'NameEP' => 'required|string|max:255',
        'MaxGradeEP' => 'nullable|numeric',
        'PorsentageEP' => 'nullable|numeric',
        'DescriptionEP' => 'nullable|string',
        'CodeEP' => 'required|string|max:255',
    ];

    // Define resource name for messages
    protected string $resourceName = 'Evaluation Type';
    public function index(Request $request)
{
    $evaluationTypes = EvaluationType::withCount("evaluations")->get();
    return response()->json([
        'success' => true,
        'data' => $evaluationTypes,
        'message' => 'Evaluation types retrieved successfully.'
    ]);
}
public function show($matriculeUT)
{
    $user = User::with(['etudiant.niveau.matieres.evaluations.evaluationType','professeur.matiere.evaluations.evaluationType'])->where('MatriculeUT', $matriculeUT)->first();
    $matieres = [];
    $evaluations = [];
    if($user->RoleUT === "etudiant"){
        $matieres = $user->etudiant->niveau->matieres;
        Log::info("ev: ",$matieres->toArray());
        foreach($matieres as $mt){
            foreach($mt->evaluations as $ev){
                array_push($evaluations,$ev->evaluationType);
            };
        };
    }else if($user->RoleUT === "professeur"){
        foreach($user->professeur->matiere->evaluations as $ev){
            Log::info("ev: ".(string) $ev);
            array_push($evaluations,$ev->evaluationType);
        };
    };
    return response()->json($evaluations);
}
    // Methods provided by CrudOperations trait
}
