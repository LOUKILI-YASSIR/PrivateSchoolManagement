<?php

namespace App\Services;

use App\Models\AcademicYear;
use App\Models\DayWeek;
use App\Models\Group;
use App\Models\Matiere;
use App\Models\Professeur;
use App\Models\RegularTimeTable;
use App\Models\Salle;
use App\Models\TimeSlot;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class TimetableGenerator
{
    protected $academicYear;
    protected $days;
    protected $timeSlots;
    protected $groups;
    protected $subjects;
    protected $professors;
    protected $rooms;
    protected $levelSessionCounts = [];
    protected $groupSessionCounts = [];
    protected $professorDailySlots = [];

    public function __construct()
    {
        $this->academicYear = AcademicYear::currentYear();
        $this->days = DayWeek::all();
        $this->timeSlots = TimeSlot::all()->sortBy('StartTimeTS');
        $this->groups = Group::where('MatriculeYR', $this->academicYear->MatriculeYR)->get();
        $this->subjects = Matiere::where('MatriculeYR', $this->academicYear->MatriculeYR)->get();
        $this->professors = Professeur::where('MatriculeYR', $this->academicYear->MatriculeYR)->get();
        $this->rooms = Salle::where('MatriculeYR', $this->academicYear->MatriculeYR)
                           ->where('StatusSL', 'disponible')
                           ->get();
    }

    public function generateTimetable()
    {
        DB::beginTransaction();
        try {
            // Clear existing timetable for the current academic year
            RegularTimeTable::where('MatriculeYR', $this->academicYear->MatriculeYR)->delete();

            // Step 1: Calculate sessions per subject for each level
            $this->calculateLevelSessionCounts();

            $timetable = [];
            $professorHours = [];
            
            // Step 2: Generate optimized timetables for each group
            foreach ($this->groups as $group) {
                $groupTimetable = $this->generateOptimizedGroupTimetable($group, $professorHours);
                $timetable[$group->MatriculeGP] = $groupTimetable;
                
                // Save the timetable entries
                foreach ($groupTimetable as $entry) {
                    if ($entry['subject']) { // Only save non-empty slots
                        RegularTimeTable::create([
                            'MatriculeYR' => $this->academicYear->MatriculeYR,
                            'MatriculeDW' => $entry['day']->MatriculeDW,
                            'MatriculeTS' => $entry['timeSlot']->MatriculeTS,
                            'MatriculeGP' => $group->MatriculeGP,
                            'MatriculeMT' => $entry['subject']->MatriculeMT,
                            'MatriculePR' => $entry['professor']->MatriculePR,
                            'MatriculeSL' => $entry['room']->MatriculeSL,
                        ]);
                    }
                }
            }

            DB::commit();
            return [
                'status' => 'success',
                'message' => 'Timetable generated successfully',
                'timetable' => $timetable
            ];
        } catch (\Exception $e) {
            DB::rollBack();
            return [
                'status' => 'error',
                'message' => 'Failed to generate timetable: ' . $e->getMessage()
            ];
        }
    }

    protected function calculateLevelSessionCounts()
    {
        // Group subjects by level and ensure EXACT session allocation
        $groupsByLevel = $this->groups->groupBy('MatriculeNV');
        
        foreach ($groupsByLevel as $level => $groups) {
            $subjectsForLevel = $this->subjects->where('MatriculeNV', $level);
            
            if ($subjectsForLevel->count() == 0) continue;
            
            // Calculate exact sessions per subject based on max_sessions_per_week
            foreach ($subjectsForLevel as $subject) {
                $exactSessions = $subject->max_sessions_per_week ?? 1;
                $this->levelSessionCounts[$level][$subject->MatriculeMT] = $exactSessions;
                
                // Set the same for ALL groups in this level
                foreach ($groups as $group) {
                    $this->groupSessionCounts[$group->MatriculeGP][$subject->MatriculeMT] = $exactSessions;
                }
            }
            
            // Log the allocation for this level
            $totalSessions = array_sum($this->levelSessionCounts[$level]);
            Log::info("Level {$level}: Total sessions allocated = {$totalSessions}");
        }
    }

    protected function generateOptimizedGroupTimetable($group, &$professorHours)
    {
        $timetable = [];
        $subjectsForGroup = $this->subjects->where('MatriculeNV', $group->MatriculeNV);
        
        // Initialize tracking for this group
        $remainingSessions = [];
        foreach ($subjectsForGroup as $subject) {
            $remainingSessions[$subject->MatriculeMT] = $this->groupSessionCounts[$group->MatriculeGP][$subject->MatriculeMT];
        }
        
        Log::info("Group {$group->MatriculeGP} needs sessions: " . json_encode($remainingSessions));
        
        // Generate timetable ensuring EXACT session counts
        foreach ($this->days as $day) {
            foreach ($this->timeSlots as $timeSlot) {
                $entry = [
                    'day' => $day,
                    'timeSlot' => $timeSlot,
                    'subject' => null,
                    'professor' => null,
                    'room' => null
                ];

                // Find a subject that still needs sessions
                $selectedSubject = $this->selectSubjectWithRemainingSessions($remainingSessions, $subjectsForGroup);
                
                if ($selectedSubject) {
                    $professor = $this->findAvailableProfessor($selectedSubject, $day, $timeSlot, $professorHours);
                    $room = $this->findAvailableRoom($day, $timeSlot);
                    
                    if ($professor && $room) {
                        $entry['subject'] = $selectedSubject;
                        $entry['professor'] = $professor;
                        $entry['room'] = $room;
                        
                        // Update tracking
                        $professorHours[$professor->MatriculePR][$day->MatriculeDW] = 
                            ($professorHours[$professor->MatriculePR][$day->MatriculeDW] ?? 0) + 1;
                        
                        // Decrease remaining sessions
                        $remainingSessions[$selectedSubject->MatriculeMT]--;
                        
                        Log::debug("Assigned {$selectedSubject->MatriculeMT} to {$group->MatriculeGP}, remaining: {$remainingSessions[$selectedSubject->MatriculeMT]}");
                    }
                }

                $timetable[] = $entry;
            }
        }
        
        // Verify exact session allocation
        $this->verifySessionAllocation($group, $remainingSessions);
        
        // Apply session merging
        $timetable = $this->mergeConsecutiveSessionsInTimetable($timetable);

        return $timetable;
    }

    protected function selectSubjectWithRemainingSessions($remainingSessions, $subjects)
    {
        // Create weighted selection - prioritize subjects with more remaining sessions
        $availableSubjects = [];
        
        foreach ($subjects as $subject) {
            $remaining = $remainingSessions[$subject->MatriculeMT] ?? 0;
            if ($remaining > 0) {
                // Add subject multiple times based on remaining sessions for weighted random selection
                for ($i = 0; $i < $remaining; $i++) {
                    $availableSubjects[] = $subject;
                }
            }
        }
        
        if (empty($availableSubjects)) {
            return null;
        }
        
        // Random selection from weighted array
        return $availableSubjects[array_rand($availableSubjects)];
    }

    protected function verifySessionAllocation($group, $remainingSessions)
    {
        $unallocatedSessions = array_filter($remainingSessions, function($count) {
            return $count > 0;
        });
        
        if (!empty($unallocatedSessions)) {
            Log::warning("Group {$group->MatriculeGP} has unallocated sessions: " . json_encode($unallocatedSessions));
        } else {
            Log::info("Group {$group->MatriculeGP} - All sessions allocated successfully!");
        }
    }

    protected function mergeConsecutiveSessionsInTimetable($timetable)
    {
        // Group by day first
        $dailyTimetables = [];
        foreach ($timetable as $entry) {
            $dayId = $entry['day']->MatriculeDW;
            $dailyTimetables[$dayId][] = $entry;
        }
        
        $mergedTimetable = [];
        foreach ($dailyTimetables as $dailySchedule) {
            $mergedDaily = $this->mergeConsecutiveSessions($dailySchedule);
            $mergedTimetable = array_merge($mergedTimetable, $mergedDaily);
        }
        
        return $mergedTimetable;
    }

    protected function generateSessionPattern($totalSessions)
    {
        $pattern = [];
        $remaining = $totalSessions;
        
        while ($remaining > 0) {
            // Randomly choose session length (1-3 consecutive sessions)
            $sessionLength = min($remaining, rand(1, 3));
            
            // Add some variety in session lengths
            if ($remaining >= 4 && rand(1, 100) <= 30) {
                $sessionLength = min($remaining, rand(2, 4)); // Longer sessions occasionally
            }
            
            $pattern[] = $sessionLength;
            $remaining -= $sessionLength;
        }
        
        // Shuffle the pattern for randomness
        shuffle($pattern);
        return $pattern;
    }

    protected function generateDailyTimetable($day, $sessionPatterns, &$professorHours, $group)
    {
        $dailySchedule = [];
        $subjectsForGroup = $this->subjects->where('MatriculeNV', $group->MatriculeNV);
        $subjectQueue = collect();
        
        // Create a queue of all sessions needed for this group
        foreach ($subjectsForGroup as $subject) {
            $sessionsNeeded = $this->levelSessionCounts[$group->MatriculeNV][$subject->MatriculeMT] ?? 1;
            $dailyShare = max(1, ceil($sessionsNeeded / $this->days->count()));
            
            // Add subject to queue multiple times based on daily share
            for ($i = 0; $i < $dailyShare; $i++) {
                $subjectQueue->push($subject);
            }
        }
        
        // Shuffle the queue for random distribution
        $subjectQueue = $subjectQueue->shuffle();
        $queueIndex = 0;
        
        // Fill ALL time slots
        foreach ($this->timeSlots as $timeSlot) {
            $entry = [
                'day' => $day,
                'timeSlot' => $timeSlot,
                'subject' => null,
                'professor' => null,
                'room' => null
            ];

            // Try to assign a subject from the queue
            $attempts = 0;
            $maxAttempts = $subjectQueue->count() * 2; // Prevent infinite loops
            
            while ($attempts < $maxAttempts && $queueIndex < $subjectQueue->count()) {
                $subject = $subjectQueue[$queueIndex % $subjectQueue->count()];
                
                $professor = $this->findAvailableProfessor($subject, $day, $timeSlot, $professorHours);
                $room = $this->findAvailableRoom($day, $timeSlot);
                
                if ($professor && $room) {
                    $entry['subject'] = $subject;
                    $entry['professor'] = $professor;
                    $entry['room'] = $room;
                    
                    // Update tracking
                    $professorHours[$professor->MatriculePR][$day->MatriculeDW] = 
                        ($professorHours[$professor->MatriculePR][$day->MatriculeDW] ?? 0) + 1;
                    
                    // Move to next subject in queue
                    $queueIndex++;
                    break;
                }
                
                $queueIndex++;
                $attempts++;
            }
            
            // If we couldn't find a subject from queue, try any available subject
            if (!$entry['subject']) {
                foreach ($subjectsForGroup->shuffle() as $subject) {
                    $professor = $this->findAvailableProfessor($subject, $day, $timeSlot, $professorHours);
                    $room = $this->findAvailableRoom($day, $timeSlot);
                    
                    if ($professor && $room) {
                        $entry['subject'] = $subject;
                        $entry['professor'] = $professor;
                        $entry['room'] = $room;
                        
                        $professorHours[$professor->MatriculePR][$day->MatriculeDW] = 
                            ($professorHours[$professor->MatriculePR][$day->MatriculeDW] ?? 0) + 1;
                        break;
                    }
                }
            }
            
            $dailySchedule[] = $entry;
        }
        
        return $dailySchedule;
    }

    // Helper method to get timetable statistics

    protected function mergeConsecutiveSessions($dailySchedule)
    {
        $optimized = [];
        $i = 0;
        
        while ($i < count($dailySchedule)) {
            $current = $dailySchedule[$i];
            
            if (!$current['subject']) {
                $optimized[] = $current;
                $i++;
                continue;
            }
            
            // Look for consecutive sessions of the same subject with gaps
            $consecutiveGroup = [$current];
            $j = $i + 1;
            
            while ($j < count($dailySchedule)) {
                $next = $dailySchedule[$j];
                
                if ($next['subject'] && 
                    $next['subject']->MatriculeMT === $current['subject']->MatriculeMT &&
                    $j - $i <= 3) { // Within 3 slots
                    
                    // Fill gaps between consecutive sessions
                    for ($k = $i + 1; $k < $j; $k++) {
                        if (!$dailySchedule[$k]['subject']) {
                            $dailySchedule[$k] = $this->createFillerSession($current, $dailySchedule[$k]);
                        }
                    }
                    
                    $consecutiveGroup[] = $next;
                    $j++;
                } else {
                    break;
                }
            }
            
            // Add the consecutive group to optimized schedule
            foreach ($consecutiveGroup as $session) {
                $optimized[] = $session;
            }
            
            $i = max($i + 1, $j);
        }
        
        return $optimized;
    }

    protected function createFillerSession($templateSession, $emptySlot)
    {
        return [
            'day' => $emptySlot['day'],
            'timeSlot' => $emptySlot['timeSlot'],
            'subject' => $templateSession['subject'],
            'professor' => $templateSession['professor'],
            'room' => $templateSession['room']
        ];
    }

    protected function findAvailableProfessor($subject, $day, $timeSlot, $professorHours)
    {
        $professors = $this->professors->where('MatriculeMT', $subject->MatriculeMT);
        
        // If no professors specifically for this subject, try all professors
        if ($professors->isEmpty()) {
            $professors = $this->professors;
        }
        
        foreach ($professors as $professor) {
            // More lenient daily hours limit - use all available time slots
            $maxDailyHours = $professor->daily_hours_limit ?? $this->timeSlots->count();
            $dailyHours = $professorHours[$professor->MatriculePR][$day->MatriculeDW] ?? 0;
            
            if ($dailyHours >= $maxDailyHours) {
                continue;
            }

            // Check if professor is available in this slot
            $isBusy = RegularTimeTable::where('MatriculePR', $professor->MatriculePR)
                ->where('MatriculeDW', $day->MatriculeDW)
                ->where('MatriculeTS', $timeSlot->MatriculeTS)
                ->exists();

            if (!$isBusy) {
                return $professor;
            }
        }
        return null;
    }

    protected function findAvailableRoom($day, $timeSlot)
    {
        foreach ($this->rooms as $room) {
            $isBusy = RegularTimeTable::where('MatriculeSL', $room->MatriculeSL)
                ->where('MatriculeDW', $day->MatriculeDW)
                ->where('MatriculeTS', $timeSlot->MatriculeTS)
                ->exists();

            if (!$isBusy) {
                return $room;
            }
        }
        return null;
    }

    // Helper method to force fill remaining empty slots
    protected function fillRemainingSlots($timetable, $group, &$professorHours)
    {
        $subjectsForGroup = $this->subjects->where('MatriculeNV', $group->MatriculeNV);
        $filledSlots = 0;
        
        for ($i = 0; $i < count($timetable); $i++) {
            if (!$timetable[$i]['subject']) {
                $day = $timetable[$i]['day'];
                $timeSlot = $timetable[$i]['timeSlot'];
                
                // Try each subject until we find one that works
                foreach ($subjectsForGroup->shuffle() as $subject) {
                    $professor = $this->findAvailableProfessor($subject, $day, $timeSlot, $professorHours);
                    $room = $this->findAvailableRoom($day, $timeSlot);
                    
                    if ($professor && $room) {
                        $timetable[$i]['subject'] = $subject;
                        $timetable[$i]['professor'] = $professor;
                        $timetable[$i]['room'] = $room;
                        
                        $professorHours[$professor->MatriculePR][$day->MatriculeDW] = 
                            ($professorHours[$professor->MatriculePR][$day->MatriculeDW] ?? 0) + 1;
                        
                        $filledSlots++;
                        break;
                    }
                }
            }
        }
        
        Log::info("Filled {$filledSlots} additional slots for group {$group->MatriculeGP}");
        return $timetable;
    }
    public function getTimetableStatistics($groupId = null)
    {
        $query = RegularTimeTable::where('MatriculeYR', $this->academicYear->MatriculeYR);
        
        if ($groupId) {
            $query->where('MatriculeGP', $groupId);
        }
        
        $sessions = $query->with(['matiere', 'group', 'day'])->get();
        
        $stats = [];
        foreach ($sessions->groupBy('MatriculeGP') as $groupSessions) {
            $group = $groupSessions->first()->group;
            $stats[$group->MatriculeNV] = $stats[$group->MatriculeNV] ?? [];
            
            foreach ($groupSessions->groupBy('MatriculeMT') as $subjectSessions) {
                $subject = $subjectSessions->first()->matiere;
                $stats[$group->MatriculeNV][$subject->MatriculeMT] = $subjectSessions->count();
            }
        }
        
        return $stats;
    }
}