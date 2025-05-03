<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Etudiant;
use App\Models\Professeur;
use App\Models\Matiere;
use App\Models\Attendance;
use App\Models\Evaluation;
use App\Models\EmploiDuTemps;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\JsonResponse;
use Exception;

class DashboardController extends Controller
{
    public function adminDashboard(): JsonResponse
    {
        try {
            $stats = [
                'total_students' => User::where('RoleUT', 'etudiant')->count(),
                'total_teachers' => User::where('RoleUT', 'professeur')->count(),
                'total_subjects' => Matiere::count(),
                'total_staff' => User::where('RoleUT', 'admin')->count(),
            ];

            $genderDistribution = [
                'male' => User::where('RoleUT', 'etudiant')->where('sexe', 'Homme')->count(),
                'female' => User::where('RoleUT', 'etudiant')->where('sexe', 'Femelle')->count(),
            ];

            $recentActivities = [];
            try {
                $recentActivities = EmploiDuTemps::latest()
                    ->take(5)
                    ->get();
            } catch (Exception $e) {
                Log::error('Recent Activities Error: ' . $e->getMessage());
            }

            $upcomingEvents = [];
            try {
                $upcomingEvents = EmploiDuTemps::where('date', '>=', now())
                    ->orderBy('date')
                    ->take(5)
                    ->get();
            } catch (Exception $e) {
                Log::error('Upcoming Events Error: ' . $e->getMessage());
            }

            return $this->successResponse([
                'stats' => $stats,
                'gender_distribution' => $genderDistribution,
                'recent_activities' => $recentActivities,
                'upcoming_events' => $upcomingEvents,
            ], 'retrieved');
        } catch (Exception $e) {
            return $this->handleException($e);
        }
    }

    public function studentDashboard($studentId): JsonResponse
    {
        try {
            // Try to find the student record - could be user ID or student matricule
            $student = null;
            
            // First, try to find by Etudiant matricule
            $student = Etudiant::with(['class', 'grades', 'attendances'])
                ->where('MatriculeET', $studentId)
                ->first();
                
            // If not found, try to find by User matricule
            if (!$student) {
                $user = User::where('MatriculeUT', $studentId)->first();
                if ($user && $user->role === 'etudiant') {
                    $student = Etudiant::with(['class', 'grades', 'attendances'])
                        ->where('MatriculeUT', $user->id)
                        ->first();
                }
            }
            
            if (!$student) {
                return $this->notFoundResponse('student');
            }

            $attendance = Attendance::where('student_id', $student->id)
                ->latest()
                ->take(10)
                ->get();

            $recentGrades = Evaluation::where('student_id', $student->id)
                ->with('subject')
                ->latest()
                ->take(5)
                ->get();

            $upcomingClasses = [];
            if ($student->class) {
                $upcomingClasses = $student->class->schedule()
                    ->where('date', '>=', now())
                    ->orderBy('date')
                    ->take(5)
                    ->get();
            }

            return $this->successResponse([
                'student_info' => $student,
                'attendance' => $attendance,
                'recent_grades' => $recentGrades,
                'upcoming_classes' => $upcomingClasses,
            ], 'retrieved');
        } catch (Exception $e) {
            return $this->handleException($e);
        }
    }

    public function professorDashboard($professorId): JsonResponse
    {
        try {
            Log::info('Professor Dashboard Request for ID: ' . $professorId);
            
            // Try to find the professor record - could be user ID or professor matricule
            $professor = null;
            
            // First check if the user exists
            $user = User::where('MatriculeUT', $professorId)->first();
            if ($user) {
                Log::info('User found with MatriculeUT: ' . $professorId);
                if ($user->role === 'professeur') {
                    // Try to find professor record connected to this user
                    $professor = Professeur::where('MatriculeUT', $user->id)
                        ->orWhere('MatriculeUT', $user->id)
                        ->first();
                }
            }
            
            // If still not found, try with professor matricule directly
            if (!$professor) {
                $professor = Professeur::with(['subjects', 'classes'])
                    ->where('MatriculePR', $professorId)
                    ->first();
                
                Log::info('Attempted direct professor lookup with MatriculePR: ' . $professorId . ', result: ' . ($professor ? 'found' : 'not found'));
            }
            
            // If professor not found, return mock data instead of error
            if (!$professor) {
                Log::warning('Professor not found for ID: ' . $professorId);
                return $this->successResponse([
                    'professor_info' => [
                        'name' => 'Professor',
                        'totalStudents' => 0,
                        'subjects' => []
                    ],
                    'class_overview' => [],
                    'upcoming_schedule' => []
                ], 'retrieved');
            }

            // Load relationships if needed
            if (!$professor->relationLoaded('subjects') || !$professor->relationLoaded('classes')) {
                $professor->load(['subjects', 'classes']);
            }

            // Get class overview
            $classOverview = [];
            try {
                $classOverview = $professor->classes()
                    ->with(['students', 'subject'])
                    ->get();
            } catch (Exception $e) {
                Log::error('Error loading class overview: ' . $e->getMessage());
            }

            // Get upcoming schedule
            $upcomingSchedule = [];
            try {
                $upcomingSchedule = $professor->schedule()
                    ->where('date', '>=', now())
                    ->orderBy('date')
                    ->take(5)
                    ->get();
            } catch (Exception $e) {
                Log::error('Error loading upcoming schedule: ' . $e->getMessage());
            }

            return $this->successResponse([
                'professor_info' => $professor,
                'class_overview' => $classOverview,
                'upcoming_schedule' => $upcomingSchedule,
            ], 'retrieved');
        } catch (Exception $e) {
            return $this->handleException($e);
        }
    }

    public function getAttendance($role, $userId): JsonResponse
    {
        try {
            if ($role === 'student') {
                $attendance = Attendance::where('student_id', $userId)
                    ->with(['class', 'subject'])
                    ->latest()
                    ->get();
            } else {
                $attendance = Attendance::where('teacher_id', $userId)
                    ->with(['class', 'subject', 'student'])
                    ->latest()
                    ->get();
            }

            return $this->successResponse(['attendance' => $attendance], 'retrieved');
        } catch (Exception $e) {
            return $this->handleException($e);
        }
    }

    public function getPerformance($role, $userId): JsonResponse
    {
        try {
            if ($role === 'student') {
                $performance = Evaluation::where('student_id', $userId)
                    ->with(['subject'])
                    ->get();
            } else {
                $performance = Evaluation::whereHas('subject', function ($query) use ($userId) {
                    $query->where('teacher_id', $userId);
                })->with(['student', 'subject'])
                    ->get();
            }

            return $this->successResponse(['performance' => $performance], 'retrieved');
        } catch (Exception $e) {
            return $this->handleException($e);
        }
    }

    public function getEvents($role, $userId): JsonResponse
    {
        try {
            $events = EmploiDuTemps::where(function ($query) use ($role, $userId) {
                if ($role === 'student') {
                    $query->where('student_id', $userId);
                } elseif ($role === 'professor') {
                    $query->where('teacher_id', $userId);
                }
            })->latest()
                ->get();

            return $this->successResponse(['events' => $events], 'retrieved');
        } catch (Exception $e) {
            return $this->handleException($e);
        }
    }

    public function submitAttendance(Request $request): JsonResponse
    {
        try {
            $validatedData = $this->validateRequest($request, [
                'class_id' => 'required|exists:class_rooms,id',
                'attendance_data' => 'required|array',
                'attendance_data.*.student_id' => 'required|exists:students,id',
                'attendance_data.*.status' => 'required|in:present,absent',
            ]);

            $classId = $validatedData['class_id'];
            $attendanceData = $validatedData['attendance_data'];

            DB::beginTransaction();
            try {
                foreach ($attendanceData as $data) {
                    Attendance::create([
                        'student_id' => $data['student_id'],
                        'class_id' => $classId,
                        'status' => $data['status'],
                        'date' => now(),
                    ]);
                }
                DB::commit();
                return $this->successResponse(null, 'created');
            } catch (Exception $e) {
                DB::rollBack();
                return $this->databaseErrorResponse($e);
            }
        } catch (Exception $e) {
            return $this->handleException($e);
        }
    }

    public function submitGrades(Request $request): JsonResponse
    {
        try {
            $validatedData = $this->validateRequest($request, [
                'class_id' => 'required|exists:class_rooms,id',
                'grades_data' => 'required|array',
                'grades_data.*.student_id' => 'required|exists:students,id',
                'grades_data.*.score' => 'required|numeric|min:0|max:100',
            ]);

            $classId = $validatedData['class_id'];
            $gradesData = $validatedData['grades_data'];

            DB::beginTransaction();
            try {
                foreach ($gradesData as $data) {
                    Evaluation::create([
                        'student_id' => $data['student_id'],
                        'class_id' => $classId,
                        'score' => $data['score'],
                        'date' => now(),
                    ]);
                }
                DB::commit();
                return $this->successResponse(null, 'created');
            } catch (Exception $e) {
                DB::rollBack();
                return $this->databaseErrorResponse($e);
            }
        } catch (Exception $e) {
            return $this->handleException($e);
        }
    }

    public function createEvent(Request $request): JsonResponse
    {
        try {
            $validatedData = $this->validateRequest($request, [
                'title' => 'required|string|max:255',
                'description' => 'required|string',
                'date' => 'required|date',
                'type' => 'required|in:class,exam,holiday,other',
                'class_id' => 'required_if:type,class|exists:class_rooms,id',
            ]);

            $event = EmploiDuTemps::create($validatedData);
            return $this->successResponse(['event' => $event], 'created');
        } catch (Exception $e) {
            return $this->handleException($e);
        }
    }

    public function getStatistics(Request $request): JsonResponse
    {
        try {
            $timeRange = $request->get('time_range', 'month');
            $startDate = now()->subMonths($timeRange === 'year' ? 12 : 1);

            $stats = [
                'total_students' => Etudiant::count(),
                'total_teachers' => Professeur::count(),
                'attendance_rate' => $this->calculateAttendanceRate($startDate),
                'average_grades' => $this->calculateAverageGrades($startDate),
                'new_enrollments' => Etudiant::where('created_at', '>=', $startDate)->count(),
            ];

            return $this->successResponse($stats, 'retrieved');
        } catch (Exception $e) {
            return $this->handleException($e);
        }
    }

    public function getPerformanceMetrics(Request $request): JsonResponse
    {
        try {
            $validatedData = $this->validateRequest($request, [
                'RoleUT' => 'required|string|in:student,teacher',
                'MatriculeUT' => 'required',
                'time_range' => 'nullable|string|in:month,year'
            ]);

            $timeRange = $validatedData['time_range'] ?? 'month';
            $startDate = now()->subMonths($timeRange === 'year' ? 12 : 1);

            $metrics = [
                'attendance_rate' => $this->calculateUserAttendanceRate($validatedData['RoleUT'], $validatedData['MatriculeUT'], $startDate),
                'average_grades' => $this->calculateUserAverageGrades($validatedData['RoleUT'], $validatedData['MatriculeUT'], $startDate),
                'participation_rate' => $this->calculateParticipationRate($validatedData['RoleUT'], $validatedData['MatriculeUT'], $startDate),
            ];

            return $this->successResponse($metrics, 'retrieved');
        } catch (Exception $e) {
            return $this->handleException($e);
        }
    }

    private function calculateAttendanceRate($startDate): float
    {
        $total = Attendance::where('date', '>=', $startDate)->count();
        $present = Attendance::where('date', '>=', $startDate)
            ->where('status', 'present')
            ->count();
        return $total > 0 ? ($present / $total) * 100 : 0;
    }

    private function calculateAverageGrades($startDate): float
    {
        return Evaluation::where('date', '>=', $startDate)->avg('score') ?? 0;
    }

    private function calculateUserAttendanceRate($role, $userId, $startDate): float
    {
        $query = Attendance::where('date', '>=', $startDate);
        if ($role === 'student') {
            $query->where('student_id', $userId);
        } else {
            $query->where('teacher_id', $userId);
        }

        $total = $query->count();
        $present = $query->where('status', 'present')->count();
        return $total > 0 ? ($present / $total) * 100 : 0;
    }

    private function calculateUserAverageGrades($role, $userId, $startDate): float
    {
        if ($role === 'student') {
            return Evaluation::where('student_id', $userId)
                ->where('date', '>=', $startDate)
                ->avg('score') ?? 0;
        } else {
            return Evaluation::whereHas('subject', function ($query) use ($userId) {
                $query->where('teacher_id', $userId);
            })->where('date', '>=', $startDate)
                ->avg('score') ?? 0;
        }
    }

    private function calculateParticipationRate($role, $userId, $startDate): float
    {
        // Implementation depends on your participation tracking system
        return 0;
    }
} 