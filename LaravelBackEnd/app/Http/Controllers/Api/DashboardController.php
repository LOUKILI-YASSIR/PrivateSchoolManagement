<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Etudiant;
use App\Models\Professeur;
use App\Models\Matiere;
use App\Models\Attendance;
use App\Models\Evaluation;
use App\Models\RegularTimeTable;
use App\Models\Group;
use App\Models\DayWeek;
use App\Models\TimeSlot;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\JsonResponse;
use Exception;

class DashboardController extends Controller
{

      //  { name: 'Garçons', value: 60 },
    //{ name: 'Filles', value: 40 }
    public function adminDashboard()
    {
        try {
            $stats = [
                'totalStudents' => Etudiant::count(),
                'totalTeachers' => Professeur::count(),
                'totalSubjects' => Matiere::count(),
                'totalGroups' => Group::count(),
            ];

            $genderDistribution = [
                [
                    'name' => 'male',
                    'value' => Etudiant::whereHas('user', function ($query) {
                                   $query->where('GenrePL', 'Homme');
                               })->count()
                ],
                [
                    'name' => 'female',
                    'value' => Etudiant::whereHas('user', function ($query) {
                                   $query->where('GenrePL', 'Femelle');
                               })->count()
                ],
            ];
            return [
                'stats' => $stats,
                'gender_distribution' => $genderDistribution,
            ];
        } catch (Exception $e) {
            return $this->handleException($e);
        }
    }

    public function studentDashboard($studentId)
    {
        try{
            $student = Etudiant::whereHas("user",function ($q ) use ($studentId){
                $q->where("MatriculeUT", $studentId);
            })->with("group")->first();
            return [
                "student" => $student,
                "selectedGroup" => $student->group->MatriculeGP ?? "null",
                "timeSlotsData" => TimeSlot::all()->toArray(),
                "daysData" => DayWeek::all()->toArray(),
            ];
        } catch (Exception $e) {
            return $this->handleException($e);
        }
    }

public function professeurDashboard($professorId)
{
    try {
        // تحميل الأستاذ مع المجموعات والطلاب والمستخدمين المرتبطين
        $professeur = User::with("professeur.groups.etudiants.user")
            ->where("MatriculeUT", $professorId)
            ->first()
            ?->professeur;

        if (!$professeur) {
            return response()->json(['error' => 'Professeur non trouvé'], 404);
        }

        $totalStudents = 0;
        $genderCount = ["male" => 0, "female" => 0];

        foreach ($professeur->groups as $group) {
            foreach ($group->etudiants as $etudiant) {
                $totalStudents++;
                $genre = strtolower($etudiant->user->GenrePL ?? '');

                if ($genre === 'homme') {
                    $genderCount["male"]++;
                } elseif ($genre === 'femelle') {
                    $genderCount["female"]++;
                }
            }
        }

        $stats = [
            'totalStudents' => $totalStudents,
            'totalGroups' => $professeur->groups->count(),
        ];

        $genderDistribution = [
            ['name' => 'male', 'value' => $genderCount["male"]],
            ['name' => 'female', 'value' => $genderCount["female"]],
        ];

        return [
            'stats' => $stats,
            'gender_distribution' => $genderDistribution,
            "selectedGroup" => $professeur->MatriculePR ?? "null",
        ];
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
            $events = RegularTimeTable::where(function ($query) use ($role, $userId) {
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

            $event = RegularTimeTable::create($validatedData);
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