<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\TimeSlot;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Exception;
use Carbon\Carbon;

class TimeSlotController extends Controller
{
    protected array $validationRules = [
        'StartTimeTS' => 'required|date_format:H:i',
        'EndTimeTS'   => 'required|date_format:H:i|after:StartTimeTS',
    ];

    protected string $resourceName = 'Time Slot';

    protected function checkTimeSlotOverlap($startTime, $endTime, $excludeId = null)
    {
        $start = Carbon::createFromFormat('H:i', $startTime);
        $end = Carbon::createFromFormat('H:i', $endTime);

        $query = TimeSlot::where(function ($query) use ($start, $end) {
            // Check if new slot overlaps with existing slots
            $query->where(function ($q) use ($start, $end) {
                // Start time falls within existing slot
                $q->where('StartTimeTS', '<=', $start->format('H:i'))
                  ->where('EndTimeTS', '>', $start->format('H:i'));
            })->orWhere(function ($q) use ($start, $end) {
                // End time falls within existing slot
                $q->where('StartTimeTS', '<', $end->format('H:i'))
                  ->where('EndTimeTS', '>=', $end->format('H:i'));
            })->orWhere(function ($q) use ($start, $end) {
                // New slot completely encompasses existing slot
                $q->where('StartTimeTS', '>=', $start->format('H:i'))
                  ->where('EndTimeTS', '<=', $end->format('H:i'));
            });
        });

        if ($excludeId) {
            $query->where('MatriculeTS', '!=', $excludeId);
        }

        return $query->exists();
    }

    public function index()
    {
        return response()->json(TimeSlot::all(), 200);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), $this->validationRules, $this->messages());

        if ($validator->fails()) {
            Log::error("Validation échouée pour le {$this->resourceName}: " . json_encode($validator->errors()));
            return response()->json([
                'status' => false,
                'errors' => $validator->errors(),
                'message' => "Échec de la validation des données du {$this->resourceName}.",
            ], 422);
        }

        // Check for time slot overlap
        if ($this->checkTimeSlotOverlap($request->StartTimeTS, $request->EndTimeTS)) {
            return response()->json([
                'status' => false,
                'message' => "Ce créneau horaire chevauche un créneau existant.",
            ], 422);
        }

        try {
            $timeSlot = TimeSlot::create($request->only(['StartTimeTS', 'EndTimeTS']));

            return response()->json([
                'status' => true,
                'message' => "{$this->resourceName} créé avec succès.",
                'data' => $timeSlot,
            ], 201);
        } catch (Exception $e) {
            Log::error("Erreur lors de la création du {$this->resourceName} : " . $e->getMessage());

            return response()->json([
                'status' => false,
                'message' => "Une erreur est survenue lors de la création du {$this->resourceName}.",
            ], 500);
        }
    }

    public function update(Request $request, $MatriculeTS)
    {
        $timeSlot = TimeSlot::find($MatriculeTS);

        if (!$timeSlot) {
            return response()->json([
                'status' => false,
                'message' => "{$this->resourceName} non trouvé.",
            ], 404);
        }

        $validator = Validator::make($request->all(), $this->validationRules, $this->messages());

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validator->errors(),
                'message' => "Échec de la validation des données du {$this->resourceName}.",
            ], 422);
        }

        // Check for time slot overlap, excluding current time slot
        if ($this->checkTimeSlotOverlap($request->StartTimeTS, $request->EndTimeTS, $MatriculeTS)) {
            return response()->json([
                'status' => false,
                'message' => "Ce créneau horaire chevauche un créneau existant.",
            ], 422);
        }

        try {
            $timeSlot->update($request->only(['StartTimeTS', 'EndTimeTS']));

            return response()->json([
                'status' => true,
                'message' => "{$this->resourceName} mis à jour avec succès.",
                'data' => $timeSlot,
            ], 200);
        } catch (Exception $e) {
            Log::error("Erreur lors de la mise à jour du {$this->resourceName} ID {$MatriculeTS} : " . $e->getMessage());

            return response()->json([
                'status' => false,
                'message' => "Une erreur est survenue lors de la mise à jour du {$this->resourceName}.",
            ], 500);
        }
    }

    public function destroy($MatriculeTS)
    {
        $timeSlot = TimeSlot::find($MatriculeTS);

        if (!$timeSlot) {
            return response()->json([
                'status' => false,
                'message' => "{$this->resourceName} non trouvé.",
            ], 404);
        }

        try {
            $timeSlot->delete();

            return response()->json([
                'status' => true,
                'message' => "{$this->resourceName} supprimé avec succès.",
            ], 200);
        } catch (Exception $e) {
            Log::error("Erreur lors de la suppression du {$this->resourceName} ID {$MatriculeTS} : " . $e->getMessage());

            return response()->json([
                'status' => false,
                'message' => "Une erreur est survenue lors de la suppression du {$this->resourceName}.",
            ], 500);
        }
    }

    protected function messages(): array
    {
        return [
            'StartTimeTS.required'      => 'L\'heure de début est obligatoire.',
            'StartTimeTS.date_format'   => 'Le format de l\'heure de début doit être HH:MM.',
            'EndTimeTS.required'        => 'L\'heure de fin est obligatoire.',
            'EndTimeTS.date_format'     => 'Le format de l\'heure de fin doit être HH:MM.',
            'EndTimeTS.after'           => 'L\'heure de fin doit être après l\'heure de début.',
        ];
    }
}
