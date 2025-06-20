<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\AcademicYear;
use App\Models\Professeur;
use App\Services\TimetableGenerator;
use App\Traits\CrudOperations;
use App\Models\RegularTimeTable;
use App\Models\Salle;
use App\Models\DayWeek;
use App\Models\TimeSlot;
use App\Models\Group;
use App\Models\Matiere;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;
use Illuminate\Support\Facades\Validator;

class RegularTimeTableController extends Controller
{
    use CrudOperations;

    protected string $model = RegularTimeTable::class;

    protected array $validationRules = [
        'MatriculeDW' => 'required|string|exists:day_weeks,MatriculeDW',
        'MatriculeTS' => 'required|string|exists:time_slots,MatriculeTS',
        'MatriculeGP' => 'required|string|exists:groups,MatriculeGP',
        'MatriculeMT' => 'required|string|exists:matieres,MatriculeMT',
        'MatriculePR' => 'required|string|exists:professeurs,MatriculePR',
        'MatriculeSL' => 'required|string|exists:salles,MatriculeSL',
    ];

    protected string $resourceName = 'Regular Time Table Entry';

    public function getAllTimeTableClasses($MatriculeGP = null)
    {
        $timeTables = RegularTimeTable::with([
            'dayWeek',
            'timeSlot',
            'group',
            'matiere',
            'professeur.user',
            'salle'
        ]);

        if ($MatriculeGP) {
            if (str_contains($MatriculeGP, 'GP')) {
                $timeTables = $timeTables->where('MatriculeGP', $MatriculeGP);
            } else if (str_contains($MatriculeGP, 'PR')) {
                $timeTables = $timeTables->where('MatriculePR', $MatriculeGP);
            }
        }

        return $timeTables->get();
    }

    public function getAllUnusedResources($MatriculeTS = null, $MatriculeDW = null, $MatriculeGP = null)
    {
        $usedProfesseurs = RegularTimeTable::when($MatriculeTS, function($query) use ($MatriculeTS) {
            $query->where('MatriculeTS', $MatriculeTS);
        })
        ->when($MatriculeDW, function($query) use ($MatriculeDW) {
            $query->where('MatriculeDW', $MatriculeDW);
        })
        ->pluck('MatriculePR');

        $usedSalles = RegularTimeTable::when($MatriculeTS, function($query) use ($MatriculeTS) {
            $query->where('MatriculeTS', $MatriculeTS);
        })
        ->when($MatriculeDW, function($query) use ($MatriculeDW) {
            $query->where('MatriculeDW', $MatriculeDW);
        })
        ->pluck('MatriculeSL');

        $unusedProfesseurs = Professeur::whereNotIn('MatriculePR', $usedProfesseurs)
            ->with("user", "matiere")
            ->get();

        $countEtudiants = null;
        if ($MatriculeGP) {
            $groupe = Group::withCount('etudiants')->find($MatriculeGP);
            $countEtudiants = $groupe ? $groupe->etudiants_count : 0;
        }

        $unusedSalles = Salle::whereNotIn('MatriculeSL', $usedSalles)
            ->when($countEtudiants !== null, function ($query) use ($countEtudiants) {
                $query->where('CapacitySL', '>=', $countEtudiants);
            })
            ->get();

        return response()->json([
            'professeurs' => $unusedProfesseurs,
            'salles' => $unusedSalles,
        ]);
    }

    public function index()
    {
        $timeTables = RegularTimeTable::with([
            'dayWeek',
            'timeSlot',
            'group',
            'matiere',
            'professeur',
            'salle'
        ])->get();

        return response()->json($timeTables);
    }

    public function store(Request $request)
    {
        $validated = $request->validate($this->validationRules);
        $currentYear = AcademicYear::currentYear()->MatriculeYR;
        $validated['MatriculeYR'] = $currentYear;

        $conflict = RegularTimeTable::where('MatriculeDW', $validated['MatriculeDW'])
            ->where('MatriculeTS', $validated['MatriculeTS'])
            ->where(function($query) use ($validated) {
                $query->where('MatriculeGP', $validated['MatriculeGP'])
                    ->orWhere('MatriculePR', $validated['MatriculePR'])
                    ->orWhere('MatriculeSL', $validated['MatriculeSL']);
            })
            ->first();

        if ($conflict) {
            return response()->json([
                'message' => 'Time slot conflict detected',
                'conflict' => $conflict->load([
                    'dayWeek',
                    'timeSlot',
                    'group',
                    'matiere',
                    'professeur.user',
                    'professeur.matiere',
                    'salle'
                ])
            ], 422);
        }

        try {
            DB::beginTransaction();

            $timeTable = RegularTimeTable::create($validated);

            DB::commit();

            return response()->json($timeTable->load([
                'dayWeek',
                'timeSlot',
                'group',
                'matiere',
                'professeur.user',
                'salle'
            ]));
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Error creating time table entry: ' . $e->getMessage()], 500);
        }
    }

    public function show(string $id)
    {
        $timeTable = RegularTimeTable::with([
            'dayWeek',
            'timeSlot',
            'group',
            'matiere',
            'professeur',
            'salle'
        ])->findOrFail($id);

        return response()->json($timeTable);
    }

    public function update(Request $request, string $MatriculeRT)
    {
        $timeTable = RegularTimeTable::findOrFail($MatriculeRT);
        $validated = $request->validate($this->validationRules);
        $currentYear = AcademicYear::currentYear()->MatriculeYR;
        $validated['MatriculeYR'] = $currentYear;

        try {
            DB::beginTransaction();

            $timeTable->update($validated);

            DB::commit();

            return response()->json($timeTable->load([
                'dayWeek',
                'timeSlot',
                'group',
                'matiere',
                'professeur.user',
                'salle'
            ]));
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Error updating time table entry: ' . $e->getMessage()], 500);
        }
    }

    public function destroy(string $id)
    {
        try {
            DB::beginTransaction();

            $timeTable = RegularTimeTable::findOrFail($id);
            $timeTable->delete();

            DB::commit();

            return response()->json(['message' => 'Time table entry deleted successfully']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Error deleting time table entry: ' . $e->getMessage()], 500);
        }
    }

    public function updatePosition(Request $request)
    {
        $validated = $request->validate([
            'source' => 'required|array',
            'source.day' => 'required|string',
            'source.time_slot' => 'required|string',
            'destination' => 'required|array',
            'destination.day' => 'required|string',
            'destination.time_slot' => 'required|string',
            'group_id' => 'required|string'
        ]);

        try {
            DB::beginTransaction();

            $sourceDayId = DayWeek::where('MatriculeDW', $validated['source']['day'])->value('MatriculeDW');
            $sourceTimeSlotId = TimeSlot::where('MatriculeTS', $validated['source']['time_slot'])->value('MatriculeTS');
            $destDayId = DayWeek::where('MatriculeDW', $validated['destination']['day'])->value('MatriculeDW');
            $destTimeSlotId = TimeSlot::where('MatriculeTS', $validated['destination']['time_slot'])->value('MatriculeTS');

            if (!$sourceDayId || !$sourceTimeSlotId || !$destDayId || !$destTimeSlotId) {
                return response()->json(['message' => 'Invalid source or destination identifiers'], 422);
            }

            $groupId = $validated['group_id'];

            $sourceEntry = RegularTimeTable::where('MatriculeGP', $groupId)
                ->where('MatriculeDW', $sourceDayId)
                ->where('MatriculeTS', $sourceTimeSlotId)
                ->first();

            $destEntry = RegularTimeTable::where('MatriculeGP', $groupId)
                ->where('MatriculeDW', $destDayId)
                ->where('MatriculeTS', $destTimeSlotId)
                ->first();

            $conflictingEntries = RegularTimeTable::where('MatriculeDW', $destDayId)
                ->where('MatriculeTS', $destTimeSlotId)
                ->where('MatriculeGP', '!=', $groupId)
                ->get();

            $destinationProfesseurUsed = false;
            $destinationSalleUsed = false;

            foreach ($conflictingEntries as $entry) {
                if ($sourceEntry && $entry->MatriculePR == $sourceEntry->MatriculePR) {
                    $destinationProfesseurUsed = true;
                }
                if ($sourceEntry && $entry->MatriculeSL == $sourceEntry->MatriculeSL) {
                    $destinationSalleUsed = true;
                }
            }

            if ($destinationProfesseurUsed || $destinationSalleUsed) {
                $conflictType = [];
                if ($destinationProfesseurUsed) $conflictType[] = 'professeur';
                if ($destinationSalleUsed) $conflictType[] = 'salle';
                return response()->json([
                    'message' => 'Conflit détecté dans la destination avec : ' . implode(' et ', $conflictType)
                ], 409);
            }

            if ($sourceEntry && !$destEntry) {
                $sourceEntry->update([
                    'MatriculeDW' => $destDayId,
                    'MatriculeTS' => $destTimeSlotId
                ]);
            } elseif (!$sourceEntry && $destEntry) {
                $destEntry->delete();
            } elseif ($sourceEntry && $destEntry) {
                $temp = [
                    'MatriculeDW' => $sourceEntry->MatriculeDW,
                    'MatriculeTS' => $sourceEntry->MatriculeTS
                ];
                $sourceEntry->update([
                    'MatriculeDW' => $destDayId,
                    'MatriculeTS' => $destTimeSlotId
                ]);
                $destEntry->update($temp);
            }

            DB::commit();

            return response()->json(['message' => 'Position mise à jour avec succès']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Erreur lors du déplacement : ' . $e->getMessage()], 500);
        }
    }

    public function getTimeTableFormConfig()
    {
        return [
            'days' => DayWeek::all()?->toArray() ?? [],
            'timesSlot' => TimeSlot::all()?->toArray() ?? []
        ];
    }

    public function ConfigTimeTable(Request $request)
    {
        try {
            $data = $request->all();
            
            $structureValidator = Validator::make($data, [
                'days' => 'required|array|min:1',
                'days.*' => 'required|string',
                'timeSlots' => 'required|array|min:1',
                'timeSlots.*.MatriculeTS' => 'required|string',
                'timeSlots.*.StartTimeTS' => 'required|string',
                'timeSlots.*.EndTimeTS' => 'required|string',
                'MatriculeYR' => 'required|string'
            ]);

            if ($structureValidator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Invalid data structure',
                    'errors' => $structureValidator->errors()
                ], 422);
            }

            $daysValidation = $this->validateDays($data['days']);
            if (!$daysValidation['valid']) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Invalid days validation',
                    'errors' => $daysValidation['errors']
                ], 422);
            }

            $timeSlotsValidation = $this->validateTimeSlots($data['timeSlots']);
            if (!$timeSlotsValidation['valid']) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Invalid time slots validation',
                    'errors' => $timeSlotsValidation['errors']
                ], 422);
            }

            DB::beginTransaction();

            DB::statement('SET FOREIGN_KEY_CHECKS=0;');
            RegularTimeTable::truncate();
            TimeSlot::truncate();
            DayWeek::truncate();
            DB::statement('SET FOREIGN_KEY_CHECKS=1;');

            foreach ($data['days'] as $day) {
                DayWeek::create([
                    'MatriculeDW' => 'DW' . strtoupper(substr($day, 0, 3)) . rand(1000, 9999),
                    'DayNameDW' => $day,
                ]);
            }

            foreach ($data['timeSlots'] as $timeSlot) {
                TimeSlot::create([
                    'MatriculeTS' => $timeSlot['MatriculeTS'],
                    'StartTimeTS' => $timeSlot['StartTimeTS'],
                    'EndTimeTS' => $timeSlot['EndTimeTS'],
                ]);
            }

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Time table configuration created successfully',
                'data' => [
                    'days_created' => count($data['days']),
                    'time_slots_created' => count($data['timeSlots']),
                    'MatriculeYR' => $data['MatriculeYR']
                ]
            ], 200);

        } catch (\Exception $e) {
            DB::rollback();
            Log::error($e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to create time table configuration',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    private function validateDays($days)
    {
        $validDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        $errors = [];

        $duplicates = array_diff_assoc($days, array_unique($days));
        if (!empty($duplicates)) {
            $errors[] = 'Duplicate days found: ' . implode(', ', array_unique($duplicates));
        }

        foreach ($days as $index => $day) {
            $dayLower = strtolower(trim($day));
            if (!in_array($dayLower, $validDays)) {
                $errors[] = "Invalid day at position {$index}: '{$day}'. Valid days are: " . implode(', ', $validDays);
            }
            if (empty(trim($day))) {
                $errors[] = "Empty day at position {$index}";
            }
        }

        return [
            'valid' => empty($errors),
            'errors' => $errors
        ];
    }

    private function validateTimeSlots($timeSlots)
    {
        $errors = [];

        $matricules = array_column($timeSlots, 'MatriculeTS');
        $duplicateMatricules = array_diff_assoc($matricules, array_unique($matricules));
        if (!empty($duplicateMatricules)) {
            $errors[] = 'Duplicate MatriculeTS found: ' . implode(', ', array_unique($duplicateMatricules));
        }

        foreach ($timeSlots as $index => $timeSlot) {
            $slotErrors = $this->validateSingleTimeSlot($timeSlot, $index);
            $errors = array_merge($errors, $slotErrors);
        }

        if (empty($errors)) {
            $overlapErrors = $this->checkTimeOverlaps($timeSlots);
            $errors = array_merge($errors, $overlapErrors);
        }

        return [
            'valid' => empty($errors),
            'errors' => $errors
        ];
    }

    private function validateSingleTimeSlot($timeSlot, $index)
    {
        $errors = [];

        if (empty($timeSlot['MatriculeTS'])) {
            $errors[] = "MatriculeTS is required for time slot at position {$index}";
        }

        if (empty($timeSlot['StartTimeTS'])) {
            $errors[] = "StartTimeTS is required for time slot at position {$index}";
        }

        if (empty($timeSlot['EndTimeTS'])) {
            $errors[] = "EndTimeTS is required for time slot at position {$index}";
        }

        if (!empty($timeSlot['StartTimeTS']) && !$this->isValidTimeFormat($timeSlot['StartTimeTS'])) {
            $errors[] = "Invalid StartTimeTS format at position {$index}: '{$timeSlot['StartTimeTS']}'. Expected format: HH:MM";
        }

        if (!empty($timeSlot['EndTimeTS']) && !$this->isValidTimeFormat($timeSlot['EndTimeTS'])) {
            $errors[] = "Invalid EndTimeTS format at position {$index}: '{$timeSlot['EndTimeTS']}'. Expected format: HH:MM";
        }

        if (!empty($timeSlot['StartTimeTS']) && !empty($timeSlot['EndTimeTS']) &&
            $this->isValidTimeFormat($timeSlot['StartTimeTS']) && $this->isValidTimeFormat($timeSlot['EndTimeTS'])) {
            $startTime = Carbon::createFromFormat('H:i', $timeSlot['StartTimeTS']);
            $endTime = Carbon::createFromFormat('H:i', $timeSlot['EndTimeTS']);

            if ($startTime->greaterThanOrEqualTo($endTime)) {
                $errors[] = "StartTimeTS must be before EndTimeTS for time slot at position {$index}";
            }

            if ($startTime->diffInMinutes($endTime) < 30) {
                $errors[] = "Time slot duration must be at least 30 minutes for slot at position {$index}";
            }
        }

        return $errors;
    }

    private function checkTimeOverlaps($timeSlots)
    {
        $errors = [];

        for ($i = 0; $i < count($timeSlots); $i++) {
            for ($j = $i + 1; $j < count($timeSlots); $j++) {
                $slot1 = $timeSlots[$i];
                $slot2 = $timeSlots[$j];

                if (!$this->isValidTimeFormat($slot1['StartTimeTS']) || !$this->isValidTimeFormat($slot1['EndTimeTS']) ||
                    !$this->isValidTimeFormat($slot2['StartTimeTS']) || !$this->isValidTimeFormat($slot2['EndTimeTS'])) {
                    continue;
                }

                $start1 = Carbon::createFromFormat('H:i', $slot1['StartTimeTS']);
                $end1 = Carbon::createFromFormat('H:i', $slot1['EndTimeTS']);
                $start2 = Carbon::createFromFormat('H:i', $slot2['StartTimeTS']);
                $end2 = Carbon::createFromFormat('H:i', $slot2['EndTimeTS']);

                if ($this->timesOverlap($start1, $end1, $start2, $end2)) {
                    $errors[] = "Time overlap detected between slots: " .
                               "'{$slot1['MatriculeTS']}' ({$slot1['StartTimeTS']}-{$slot1['EndTimeTS']}) and " .
                               "'{$slot2['MatriculeTS']}' ({$slot2['StartTimeTS']}-{$slot2['EndTimeTS']})";
                }
            }
        }

        return $errors;
    }

    private function timesOverlap($start1, $end1, $start2, $end2)
    {
        return $start1->lessThan($end2) && $start2->lessThan($end1);
    }

    private function isValidTimeFormat($time)
    {
        return preg_match('/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/', $time) === 1;
    }

    public function clear()
    {
        if (RegularTimeTable::count() > 0) {
            RegularTimeTable::truncate();
        }
        return response()->json(['message' => 'Timetable cleared successfully']);
    }

    public function generateFullTimetable()
    {
        try {
            return DB::transaction(function () {
                $currentYear = AcademicYear::currentYear();
                $days = DayWeek::whereNotIn('DayNameDW', ['Saturday', 'Sunday'])->get();
                $timeSlots = TimeSlot::orderBy('StartTimeTS')->get();
                $groups = Group::with(['niveau.matieres', 'etudiants'])->get();
                $professeurs = Professeur::with(['matiere', 'groups'])->get();
                $salles = Salle::where('StatusSL', 'active')->get();

                RegularTimeTable::where('MatriculeYR', $currentYear->MatriculeYR)->delete();

                $profHoursPerDay = [];
                $groupHoursPerDay = [];
                $salleUsage = [];
                $subjectDistribution = [];

                $isSlotAvailable = function($dayId, $timeSlotId, $groupId, $prof, $salleId) use (&$profHoursPerDay, &$groupHoursPerDay, &$salleUsage) {
                    $profDayHours = $profHoursPerDay[$prof->MatriculePR][$dayId] ?? 0;
                    if ($profDayHours >= $prof->daily_hours_limit) return false;

                    $groupDayHours = $groupHoursPerDay[$groupId][$dayId] ?? 0;
                    if ($groupDayHours >= 8) return false;

                    $salleKey = $dayId . '-' . $timeSlotId;
                    if (isset($salleUsage[$salleKey])) return false;

                    return true;
                };

                $findSuitableRoom = function($group, $salles, $dayId, $timeSlotId, &$salleUsage) {
                    return $salles->shuffle()->first(function($salle) use ($group, $salleUsage, $dayId, $timeSlotId) {
                        $key = $dayId . '-' . $timeSlotId;
                        return $salle->CapacitySL >= $group->etudiants->count() &&
                               (!isset($salleUsage[$key]) || $salleUsage[$key] !== $salle->MatriculeSL);
                    });
                };

                $findSuitableProfessor = function($matiere, $professeurs, $dayId, &$profHoursPerDay) {
                    return $professeurs->shuffle()->first(function($prof) use ($matiere, $dayId, &$profHoursPerDay) {
                        $currentHours = $profHoursPerDay[$prof->MatriculePR][$dayId] ?? 0;
                        return $prof->matiere->MatriculeMT === $matiere->MatriculeMT &&
                               $currentHours < $prof->daily_hours_limit;
                    });
                };

                foreach ($groups as $group) {
                    if ($group->etudiants->isEmpty()) continue;

                    $groupMatieres = $group->niveau->matieres;
                    $requiredHoursPerSubject = [];

                    foreach ($groupMatieres as $matiere) {
                        $requiredHoursPerSubject[$matiere->MatriculeMT] = ceil($matiere->CoefficientMT * 2);
                    }

                    $days = $days->shuffle();
                    foreach ($days as $day) {
                        $timeSlots = $timeSlots->shuffle();
                        foreach ($timeSlots as $timeSlot) {
                            if (($groupHoursPerDay[$group->MatriculeGP][$day->MatriculeDW] ?? 0) >= 8) continue;

                            $matiere = $groupMatieres->sortBy(function($m) use ($requiredHoursPerSubject, $day, &$subjectDistribution) {
                                $subjectDayCount = $subjectDistribution[$m->MatriculeMT][$day->MatriculeDW] ?? 0;
                                return ($requiredHoursPerSubject[$m->MatriculeMT] ?? 0) - $subjectDayCount;
                            })->first(function($m) use ($requiredHoursPerSubject) {
                                return ($requiredHoursPerSubject[$m->MatriculeMT] ?? 0) > 0;
                            });

                            if (!$matiere) continue;

                            $professeur = $findSuitableProfessor($matiere, $professeurs, $day->MatriculeDW, $profHoursPerDay);
                            if (!$professeur) continue;

                            $salle = $findSuitableRoom($group, $salles, $day->MatriculeDW, $timeSlot->MatriculeTS, $salleUsage);
                            if (!$salle) continue;

                            if (!$isSlotAvailable(
                                $day->MatriculeDW,
                                $timeSlot->MatriculeTS,
                                $group->MatriculeGP,
                                $professeur,
                                $salle->MatriculeSL
                            )) {
                                continue;
                            }

                            RegularTimeTable::create([
                                'MatriculeYR' => $currentYear->MatriculeYR,
                                'MatriculeDW' => $day->MatriculeDW,
                                'MatriculeTS' => $timeSlot->MatriculeTS,
                                'MatriculeGP' => $group->MatriculeGP,
                                'MatriculeMT' => $matiere->MatriculeMT,
                                'MatriculePR' => $professeur->MatriculePR,
                                'MatriculeSL' => $salle->MatriculeSL,
                            ]);

                            $profHoursPerDay[$professeur->MatriculePR][$day->MatriculeDW] =
                                ($profHoursPerDay[$professeur->MatriculePR][$day->MatriculeDW] ?? 0) + 1;

                            $groupHoursPerDay[$group->MatriculeGP][$day->MatriculeDW] =
                                ($groupHoursPerDay[$group->MatriculeGP][$day->MatriculeDW] ?? 0) + 1;

                            $salleUsage[$day->MatriculeDW . '-' . $timeSlot->MatriculeTS] = $salle->MatriculeSL;

                            $requiredHoursPerSubject[$matiere->MatriculeMT]--;
                            $subjectDistribution[$matiere->MatriculeMT][$day->MatriculeDW] =
                                ($subjectDistribution[$matiere->MatriculeMT][$day->MatriculeDW] ?? 0) + 1;
                        }
                    }
                }

                $this->mergeConsecutiveSessions();

                return response()->json([
                    'message' => 'Timetable generated and optimized successfully',
                ]);
            });
        } catch (\Exception $e) {
            Log::error('Error generating timetable: ' . $e->getMessage() . $e->getTraceAsString());
            DB::rollBack();
            return response()->json(['message' => 'Error generating timetable: ' . $e->getMessage()], 500);
        }
    }

    public function mergeConsecutiveSessions()
    {
        try {
            DB::beginTransaction();

            $days = DayWeek::whereNotIn('DayNameDW', ['Saturday', 'Sunday'])->get();
            $groups = Group::all();

            foreach ($days as $day) {
                foreach ($groups as $group) {
                    $entries = RegularTimeTable::where('MatriculeDW', $day->MatriculeDW)
                        ->where('MatriculeGP', $group->MatriculeGP)
                        ->with(['timeSlot'])
                        ->orderBy('timeSlot.StartTimeTS')
                        ->get();

                    $timeSlots = TimeSlot::orderBy('StartTimeTS')->get();
                    $timeSlotMap = $timeSlots->pluck('MatriculeTS', 'StartTimeTS')->toArray();

                    for ($i = 0; $i < $entries->count() - 2; $i++) {
                        $current = $entries[$i];
                        $next = $entries[$i + 2];

                        if ($current->MatriculePR === $next->MatriculePR &&
                            $current->MatriculeMT === $next->MatriculeMT &&
                            $current->MatriculeSL === $next->MatriculeSL) {
                            $currentEnd = Carbon::createFromFormat('H:i', $current->timeSlot->EndTimeTS);
                            $nextStart = Carbon::createFromFormat('H:i', $next->timeSlot->StartTimeTS);

                            $middle = $entries[$i + 1];
                            $middleStart = Carbon::createFromFormat('H:i', $middle->timeSlot->StartTimeTS);
                            $middleEnd = Carbon::createFromFormat('H:i', $middle->timeSlot->EndTimeTS);

                            if ($currentEnd->equalTo($middleStart) && $middleEnd->equalTo($nextStart) &&
                                $middle->MatriculePR !== $current->MatriculePR) {
                                $newEndTime = $next->timeSlot->EndTimeTS;
                                $newTimeSlot = TimeSlot::where('EndTimeTS', $newEndTime)
                                    ->where('StartTimeTS', $current->timeSlot->StartTimeTS)
                                    ->first();

                                if (!$newTimeSlot) {
                                    $newTimeSlot = TimeSlot::create([
                                        'MatriculeTS' => 'TS' . rand(1000, 9999),
                                        'StartTimeTS' => $current->timeSlot->StartTimeTS,
                                        'EndTimeTS' => $newEndTime,
                                    ]);
                                }

                                $current->update([
                                    'MatriculeTS' => $newTimeSlot->MatriculeTS
                                ]);

                                $middle->delete();
                                $next->delete();

                                $entries = RegularTimeTable::where('MatriculeDW', $day->MatriculeDW)
                                    ->where('MatriculeGP', $group->MatriculeGP)
                                    ->with(['timeSlot'])
                                    ->orderBy('timeSlot.StartTimeTS')
                                    ->get();
                                $i = -1; // Reset loop to check for further merges
                            }
                        }
                    }
                }
            }

            DB::commit();
            return response()->json(['message' => 'Consecutive sessions merged successfully']);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error merging sessions: ' . $e->getMessage());
            return response()->json(['message' => 'Error merging sessions: ' . $e->getMessage()], 500);
        }
    }

    public function generate(Request $request)
    {
        $generator = new TimetableGenerator();
        $result = $generator->generateTimetable();
        $this->mergeConsecutiveSessions();
        return response()->json($result);
    }
}