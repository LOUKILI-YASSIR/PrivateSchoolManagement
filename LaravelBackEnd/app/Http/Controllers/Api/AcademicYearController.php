<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Traits\CrudOperations;
use App\Models\AcademicYear;
use App\Models\Etudiant;
use App\Models\NoteFinal;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class AcademicYearController extends Controller
{
    use CrudOperations;

    protected string $model = AcademicYear::class;

    protected array $validationRules = [
        'StatusYR' => 'nullable|string|max:255',
        'NameYR' => 'required|string|max:255',
        'DescriptionYR' => 'nullable|string',
        'StartDateYR' => 'required|date',
        'EndDateYR' => 'required|date|after_or_equal:StartDateYR',
        'ArchivedDateYR' => 'nullable|date',
        'IsCurrentYR' => 'sometimes|boolean',
        'MatriculeUT' => 'required|string|exists:users,MatriculeUT',
    ];

    // Define resource name for messages
    protected string $resourceName = 'Academic Year';

    private function calculateStudentStatistics($academicYear)
    {
        // Get total students count
        $totalStudents = Etudiant::where('MatriculeYR', $academicYear->MatriculeYR)->count();

        // Get gender statistics
        $genderStats = Etudiant::where('MatriculeYR', $academicYear->MatriculeYR)
            ->join('users', 'etudiants.MatriculeUT', '=', 'users.MatriculeUT')
            ->select('users.GenrePL', DB::raw('count(*) as count'))
            ->groupBy('users.GenrePL')
            ->get()
            ->pluck('count', 'GenrePL')
            ->toArray();

        $boysCount = $genderStats['M'] ?? 0;
        $girlsCount = $genderStats['F'] ?? 0;

        // Calculate success statistics
        $successStats = NoteFinal::where('MatriculeYR', $academicYear->MatriculeYR)
            ->select(
                DB::raw('COUNT(*) as total'),
                DB::raw('SUM(CASE WHEN GradeNF >= 10 THEN 1 ELSE 0 END) as passed'),
                DB::raw('SUM(CASE WHEN GradeNF < 10 THEN 1 ELSE 0 END) as failed')
            )
            ->first();

        $totalNotes = $successStats->total ?? 0;
        $passedCount = $successStats->passed ?? 0;
        $failedCount = $successStats->failed ?? 0;

        // Calculate percentages
        $successPercentage = $totalNotes > 0 ? round(($passedCount / $totalNotes) * 100, 2) : 0;
        $boysPercentage = $totalStudents > 0 ? round(($boysCount / $totalStudents) * 100, 2) : 0;
        $girlsPercentage = $totalStudents > 0 ? round(($girlsCount / $totalStudents) * 100, 2) : 0;

        return [
            'total_students' => $totalStudents,
            'boys_count' => $boysCount,
            'girls_count' => $girlsCount,
            'boys_percentage' => $boysPercentage,
            'girls_percentage' => $girlsPercentage,
            'total_notes' => $totalNotes,
            'passed_count' => $passedCount,
            'failed_count' => $failedCount,
            'success_percentage' => $successPercentage
        ];
    }

    public function index()
    {
        $academicYears = AcademicYear::with(['user'])
            ->orderBy('StartDateYR', 'desc')
            ->paginate(10);

        // Load statistics only for the current page
        $academicYears->getCollection()->transform(function ($year) {
            $year->statistics = $year->getStatistics();
            $year->student_statistics = $this->calculateStudentStatistics($year);
            return $year;
        });

        return response()->json([
            'data' => $academicYears,
            'message' => 'Academic years retrieved successfully'
        ]);
    }

    public function export(Request $request)
    {
        $selectedColumns = $request->input('columns', []);
        $academicYears = AcademicYear::with(['user'])
            ->orderBy('StartDateYR', 'desc')
            ->get();

        // If no columns specified, return all data without statistics
        if (empty($selectedColumns)) {
            return response()->json([
                'data' => $academicYears,
                'message' => 'Academic years exported successfully'
            ]);
        }

        // Filter data based on selected columns
        $filteredData = $academicYears->map(function ($year) use ($selectedColumns) {
            $filtered = [];
            foreach ($selectedColumns as $column) {
                if (strpos($column, 'statistics.') === 0) {
                    $statKey = str_replace('statistics.', '', $column);
                    $statistics = $year->getStatistics();
                    $filtered[$column] = $statistics[$statKey] ?? null;
                } elseif (strpos($column, 'student_statistics.') === 0) {
                    $statKey = str_replace('student_statistics.', '', $column);
                    $studentStats = $this->calculateStudentStatistics($year);
                    $filtered[$column] = $studentStats[$statKey] ?? null;
                } else {
                    $filtered[$column] = $year->$column ?? null;
                }
            }
            return $filtered;
        });

        return response()->json([
            'data' => $filteredData,
            'message' => 'Academic years exported successfully with selected columns'
        ]);
    }

    public function getCurrentAcademicYear()
    {
        $currentYear = AcademicYear::where('IsCurrentYR', true)->first();
        return response()->json($currentYear);
    }

    public function store(Request $request)
    {
        $validated = $this->validateRequest($request, $this->validationRules);

        // ✅ Ensure start date is before end date
        if (strtotime($validated['StartDateYR']) >= strtotime($validated['EndDateYR'])) {
            return response()->json([
                'message' => 'La date de début doit être antérieure à la date de fin.',
            ], 422);
        }

        // ✅ Ensure year name is unique
        if (AcademicYear::where('NameYR', $validated['NameYR'])->exists()) {
            
            return response()->json([
                'message' => 'Le nom de l\'année scolaire doit être unique.',
            ], 422);
        }

        // ✅ Check for date overlap
        $dateOverlap = AcademicYear::where(function ($query) use ($validated) {
            $query->where(function ($query) use ($validated) {
                $query->whereBetween('StartDateYR', [$validated['StartDateYR'], $validated['EndDateYR']])
                    ->orWhereBetween('EndDateYR', [$validated['StartDateYR'], $validated['EndDateYR']]);
            })->where(function ($query) use ($validated) {
                $query->where('StartDateYR', '<', $validated['StartDateYR'])
                    ->orWhere('EndDateYR', '>', $validated['EndDateYR']);
            });
        })->exists();

        if ($dateOverlap) {
            return response()->json([
                'message' => 'Les dates de l\'année scolaire se chevauchent avec une autre année existante.',
            ], 422);
        }

        // ✅ Default settings
        $validated['IsCurrentYR'] = false;
        $validated['StatusYR'] = $validated['StatusYR'] ?? 'planifier';
        $validated['ArchivedDate'] = null;

        // ✅ Auto-activate if start date is today and status is 'planifier'
        if (
            $validated['StatusYR'] === 'planifier' &&
            \Carbon\Carbon::parse($validated['StartDateYR'])->isToday()
        ) {
            AcademicYear::where('IsCurrentYR', true)->update(['IsCurrentYR' => false]);
            $validated['IsCurrentYR'] = true;
            $validated['StatusYR'] = 'active';
        }

        // ✅ Create academic year
        $academicYear = AcademicYear::create($validated);

        // ✅ Load relationships and statistics
        $academicYear->load('user');
        $academicYear->statistics = $academicYear->getStatistics();
        $academicYear->student_statistics = $this->calculateStudentStatistics($academicYear);

        return response()->json([
            'data' => $academicYear,
            'message' => 'L\'année scolaire a été créée avec succès.'
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $academicYear = AcademicYear::findOrFail($id);
        $validated = $this->validateRequest($request, $this->validationRules);

        // ✅ Prevent modification if year is closed
        if ($academicYear->StatusYR === 'clouse') {
            return response()->json([
                'message' => 'Impossible de modifier une année scolaire clôturée.',
            ], 422);
        }

        // ✅ Validate dates
        if (strtotime($validated['StartDateYR']) >= strtotime($validated['EndDateYR'])) {
            return response()->json([
                'message' => 'La date de début doit être antérieure à la date de fin.',
            ], 422);
        }

        // ✅ Ensure year name is unique (excluding current record)
        if (AcademicYear::where('NameYR', $validated['NameYR'])
            ->where('MatriculeYR', '!=', $id)
            ->exists()) {
            return response()->json([
                'message' => 'Le nom de l\'année scolaire doit être unique.',
            ], 422);
        }

        // ✅ Check for date overlap (excluding current record)
        $dateOverlap = AcademicYear::where('MatriculeYR', '!=', $id)
            ->where(function ($query) use ($validated) {
                $query->whereBetween('StartDateYR', [$validated['StartDateYR'], $validated['EndDateYR']])
                    ->orWhereBetween('EndDateYR', [$validated['StartDateYR'], $validated['EndDateYR']])
                    ->orWhere(function ($query) use ($validated) {
                        $query->where('StartDateYR', '<=', $validated['StartDateYR'])
                            ->where('EndDateYR', '>=', $validated['EndDateYR']);
                    });
            })->exists();

        if ($dateOverlap) {
            return response()->json([
                'message' => 'Les dates de l\'année scolaire se chevauchent avec une autre année existante.',
            ], 422);
        }

        // ✅ Auto-close if end date is today
        if (\Carbon\Carbon::parse($validated['EndDateYR'])->isToday()
            || $validated['StatusYR'] === 'clouse'
        ) {
            $validated['StatusYR'] = 'clouse';
            $validated['ArchivedDateYR'] = now();
            $validated['IsCurrentYR'] = false;
        }
        // ✅ Auto-activate if start date is today and status is 'planifier'
        elseif (
            $validated['StatusYR'] === 'planifier' &&
            \Carbon\Carbon::parse($validated['StartDateYR'])->isToday()
        ) {
            AcademicYear::where('IsCurrentYR', true)->update(['IsCurrentYR' => false]);
            $validated['IsCurrentYR'] = true;
            $validated['StatusYR'] = 'active';
        }
        // ✅ Activate if manually set as current
        elseif ( $validated['StatusYR'] === "active" ) {
            AcademicYear::where('IsCurrentYR', true)->update(['IsCurrentYR' => false]);
            $validated['IsCurrentYR'] = true;
            Log::info(1);
        }

        $academicYear->update($validated);

        // ✅ Load relationships and statistics
        $academicYear->load('user');
        $academicYear->statistics = $academicYear->getStatistics();
        $academicYear->student_statistics = $this->calculateStudentStatistics($academicYear);

        return response()->json([
            'data' => $academicYear,
            'message' => 'L\'année scolaire a été mise à jour avec succès.'
        ]);
    }

    public function destroy($id)
    {
        $academicYear = AcademicYear::findOrFail($id);

        // Prevent deletion of active academic year
        if ($academicYear->IsCurrentYR) {
            return response()->json([
                'message' => 'Cannot delete the current academic year',
            ], 422);
        }

        // Prevent deletion if there are associated students
        if (Etudiant::where('MatriculeYR', $academicYear->MatriculeYR)->exists()) {
            return response()->json([
                'message' => 'Cannot delete academic year with associated students',
            ], 422);
        }

        $academicYear->delete();

        return response()->json([
            'message' => 'Academic year deleted successfully'
        ]);
    }
}