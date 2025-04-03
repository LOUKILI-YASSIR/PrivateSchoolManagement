<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Etudiant;
use App\Models\Professeur;
use App\Models\Matiere;
use App\Models\AbsenceEtudiant;
use App\Models\Evaluation;
use App\Models\EmploiDuTemps;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function adminDashboard()
    {
        try {
            $stats = [
                'total_students' => User::where('role', 'etudiant')->count(),
                'total_teachers' => User::where('role', 'professeur')->count(),
                'total_subjects' => Matiere::count(),
                'total_staff' => User::where('role', 'admin')->count(),
            ];

            $genderDistribution = [
                'male' => User::where('role', 'etudiant')->where('sexe', 'Homme')->count(),
                'female' => User::where('role', 'etudiant')->where('sexe', 'Femelle')->count(),
            ];

            // Check if EmploiDuTemps has the user relationship defined
            try {
                $recentActivities = EmploiDuTemps::latest()
                    ->take(5)
                    ->get();
            } catch (\Exception $e) {
                \Log::error('Recent Activities Error: ' . $e->getMessage());
                $recentActivities = [];
            }

            try {
                $upcomingEvents = EmploiDuTemps::where('date', '>=', now())
                    ->orderBy('date')
                    ->take(5)
                    ->get();
            } catch (\Exception $e) {
                \Log::error('Upcoming Events Error: ' . $e->getMessage());
                $upcomingEvents = [];
            }

            return response()->json([
                'stats' => $stats,
                'gender_distribution' => $genderDistribution,
                'recent_activities' => $recentActivities,
                'upcoming_events' => $upcomingEvents,
            ]);
        } catch (\Exception $e) {
            \Log::error('Admin Dashboard Error: ' . $e->getMessage());
            return response()->json([
                'error' => 'Error fetching dashboard data',
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ], 500);
        }
    }

    public function studentDashboard($studentId)
    {
        try {
            // Try to find the student record - could be user ID or student matricule
            $student = null;
            
            // First, try to find by Etudiant matricule
            $student = Etudiant::with(['class', 'grades', 'attendances'])
                ->where('matriculeEt', $studentId)
                ->first();
                
            // If not found, try to find by User matricule
            if (!$student) {
                $user = User::where('matriculeUt', $studentId)->first();
                if ($user && $user->role === 'etudiant') {
                    $student = Etudiant::with(['class', 'grades', 'attendances'])
                        ->where('matriculeUt', $user->id)
                        ->first();
                }
            }
            
            if (!$student) {
                return response()->json(['error' => 'Student not found'], 404);
            }

            $attendance = AbsenceEtudiant::where('student_id', $student->id)
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

            return response()->json([
                'student_info' => $student,
                'attendance' => $attendance,
                'recent_grades' => $recentGrades,
                'upcoming_classes' => $upcomingClasses,
            ]);
        } catch (\Exception $e) {
            \Log::error('Student Dashboard Error: ' . $e->getMessage());
            return response()->json([
                'error' => 'Error fetching student dashboard data',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function professorDashboard($professorId)
    {
        try {
            \Log::info('Professor Dashboard Request for ID: ' . $professorId);
            
            // Try to find the professor record - could be user ID or professor matricule
            $professor = null;
            
            // First check if the user exists
            $user = User::where('matriculeUt', $professorId)->first();
            if ($user) {
                \Log::info('User found with matriculeUt: ' . $professorId);
                if ($user->role === 'professeur') {
                    // Try to find professor record connected to this user
                    $professor = Professeur::where('user_id', $user->id)
                        ->orWhere('matriculeUt', $user->id)
                        ->first();
                }
            }
            
            // If still not found, try with professor matricule directly
            if (!$professor) {
                $professor = Professeur::with(['subjects', 'classes'])
                    ->where('matriculePr', $professorId)
                    ->first();
                
                \Log::info('Attempted direct professor lookup with matriculePr: ' . $professorId . ', result: ' . ($professor ? 'found' : 'not found'));
            }
            
            // If professor not found, return mock data instead of error
            if (!$professor) {
                \Log::warning('Professor not found for ID: ' . $professorId);
                return response()->json([
                    'professor_info' => [
                        'name' => 'Professor',
                        'totalStudents' => 0,
                        'subjects' => []
                    ],
                    'class_overview' => [],
                    'upcoming_schedule' => []
                ]);
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
            } catch (\Exception $e) {
                \Log::error('Error loading class overview: ' . $e->getMessage());
            }

            // Get upcoming schedule
            $upcomingSchedule = [];
            try {
                $upcomingSchedule = $professor->schedule()
                    ->where('date', '>=', now())
                    ->orderBy('date')
                    ->take(5)
                    ->get();
            } catch (\Exception $e) {
                \Log::error('Error loading upcoming schedule: ' . $e->getMessage());
            }

            return response()->json([
                'professor_info' => $professor,
                'class_overview' => $classOverview,
                'upcoming_schedule' => $upcomingSchedule,
            ]);
        } catch (\Exception $e) {
            \Log::error('Professor Dashboard Error: ' . $e->getMessage() . "\nTrace: " . $e->getTraceAsString());
            return response()->json([
                'error' => 'Error fetching professor dashboard data',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function getAttendance($role, $userId)
    {
        if ($role === 'student') {
            $attendance = AbsenceEtudiant::where('student_id', $userId)
                ->with(['class', 'subject'])
                ->latest()
                ->get();
        } else {
            $attendance = AbsenceEtudiant::where('teacher_id', $userId)
                ->with(['class', 'subject', 'student'])
                ->latest()
                ->get();
        }

        return response()->json(['attendance' => $attendance]);
    }

    public function getPerformance($role, $userId)
    {
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

        return response()->json(['performance' => $performance]);
    }

    public function getEvents($role, $userId)
    {
        $events = EmploiDuTemps::where(function ($query) use ($role, $userId) {
            if ($role === 'student') {
                $query->where('student_id', $userId);
            } elseif ($role === 'professor') {
                $query->where('teacher_id', $userId);
            }
        })->latest()
            ->get();

        return response()->json(['events' => $events]);
    }

    public function submitAttendance(Request $request)
    {
        $request->validate([
            'class_id' => 'required|exists:class_rooms,id',
            'attendance_data' => 'required|array',
            'attendance_data.*.student_id' => 'required|exists:students,id',
            'attendance_data.*.status' => 'required|in:present,absent',
        ]);

        $classId = $request->class_id;
        $attendanceData = $request->attendance_data;

        DB::beginTransaction();
        try {
            foreach ($attendanceData as $data) {
                AbsenceEtudiant::create([
                    'student_id' => $data['student_id'],
                    'class_id' => $classId,
                    'status' => $data['status'],
                    'date' => now(),
                ]);
            }
            DB::commit();
            return response()->json(['message' => 'Attendance submitted successfully']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Failed to submit attendance'], 500);
        }
    }

    public function submitGrades(Request $request)
    {
        $request->validate([
            'class_id' => 'required|exists:class_rooms,id',
            'grades_data' => 'required|array',
            'grades_data.*.student_id' => 'required|exists:students,id',
            'grades_data.*.score' => 'required|numeric|min:0|max:100',
        ]);

        $classId = $request->class_id;
        $gradesData = $request->grades_data;

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
            return response()->json(['message' => 'Grades submitted successfully']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Failed to submit grades'], 500);
        }
    }

    public function createEvent(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'date' => 'required|date',
            'type' => 'required|in:class,exam,holiday,other',
            'class_id' => 'required_if:type,class|exists:class_rooms,id',
        ]);

        $event = EmploiDuTemps::create($request->all());
        return response()->json(['event' => $event], 201);
    }

    public function getStatistics(Request $request)
    {
        $timeRange = $request->get('time_range', 'month');
        $startDate = now()->subMonths($timeRange === 'year' ? 12 : 1);

        $stats = [
            'total_students' => Etudiant::count(),
            'total_teachers' => Professeur::count(),
            'attendance_rate' => $this->calculateAttendanceRate($startDate),
            'average_grades' => $this->calculateAverageGrades($startDate),
            'new_enrollments' => Etudiant::where('created_at', '>=', $startDate)->count(),
        ];

        return response()->json($stats);
    }

    public function getPerformanceMetrics(Request $request)
    {
        $role = $request->get('role');
        $userId = $request->get('user_id');
        $timeRange = $request->get('time_range', 'month');
        $startDate = now()->subMonths($timeRange === 'year' ? 12 : 1);

        $metrics = [
            'attendance_rate' => $this->calculateUserAttendanceRate($role, $userId, $startDate),
            'average_grades' => $this->calculateUserAverageGrades($role, $userId, $startDate),
            'participation_rate' => $this->calculateParticipationRate($role, $userId, $startDate),
        ];

        return response()->json($metrics);
    }

    private function calculateAttendanceRate($startDate)
    {
        $total = AbsenceEtudiant::where('date', '>=', $startDate)->count();
        $present = AbsenceEtudiant::where('date', '>=', $startDate)
            ->where('status', 'present')
            ->count();
        return $total > 0 ? ($present / $total) * 100 : 0;
    }

    private function calculateAverageGrades($startDate)
    {
        return Evaluation::where('date', '>=', $startDate)->avg('score') ?? 0;
    }

    private function calculateUserAttendanceRate($role, $userId, $startDate)
    {
        $query = AbsenceEtudiant::where('date', '>=', $startDate);
        if ($role === 'student') {
            $query->where('student_id', $userId);
        } else {
            $query->where('teacher_id', $userId);
        }

        $total = $query->count();
        $present = $query->where('status', 'present')->count();
        return $total > 0 ? ($present / $total) * 100 : 0;
    }

    private function calculateUserAverageGrades($role, $userId, $startDate)
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

    private function calculateParticipationRate($role, $userId, $startDate)
    {
        // Implementation depends on your participation tracking system
        return 0;
    }
} 