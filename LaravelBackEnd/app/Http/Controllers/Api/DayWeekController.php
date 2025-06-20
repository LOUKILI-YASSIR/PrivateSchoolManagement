<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Traits\CrudOperations;
use App\Models\DayWeek;
use Illuminate\Http\Request;

class DayWeekController extends Controller
{
    use CrudOperations;

    protected string $model = DayWeek::class;

    protected array $validationRules = [
        'DayNameDW' => 'required|string|max:255|unique:day_weeks,DayNameDW',
    ];

    protected function getUpdateValidationRules($id): array
    {
        $rules = $this->validationRules;
        $rules['DayNameDW'] = 'required|string|max:255|unique:day_weeks,DayNameDW,' . $id . ',MatriculeDW';
        return $rules;
    }

    /**
     * Store a new DayWeek record.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
public function store(Request $request): \Illuminate\Http\JsonResponse
{
    try {
        $request->validate([
            'days' => 'required|array|min:1',
            'days.*.DayNameDW' => 'required|string|max:255',
        ]);

        // حذف كل الأيام بدون خرق علاقات المفتاح الأجنبي
        $this->model::query()->delete();

        $createdRecords = [];

        foreach ($request->input('days') as $day) {
            $createdRecords[] = $this->model::create([
                'DayNameDW' => trim($day['DayNameDW']),
            ]);
        }

        return $this->successResponse($createdRecords, 'days reset and recreated');
    } catch (\Illuminate\Validation\ValidationException $e) {
        return $this->handleValidationException($e);
    } catch (\Exception $e) {
        return $this->handleException($e);
    }
}



    /**
     * Update an existing DayWeek record.
     *
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, int $id): \Illuminate\Http\JsonResponse
    {
        try {
            $record = $this->findRecord($id);
            if (!$record) {
                return $this->notFoundResponse($this->getResourceName());
            }

            $validatedData = $this->validateRequest($request, $this->getUpdateValidationRules($id));
            $record->update($validatedData);

            if (method_exists($this, 'afterUpdate')) {
                $this->afterUpdate($record);
            }

            return $this->successResponse($record, 'updated');
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->handleValidationException($e);
        } catch (\Exception $e) {
            return $this->handleException($e);
        }
    }

    /**
     * Delete a DayWeek record.
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(int $id): \Illuminate\Http\JsonResponse
    {
        try {
            $record = $this->findRecord($id);
            if (!$record) {
                return $this->notFoundResponse($this->getResourceName());
            }

            $record->delete();

            if (method_exists($this, 'afterDestroy')) {
                $this->afterDestroy($record);
            }

            return $this->successResponse(null, 'deleted');
        } catch (\Exception $e) {
            return $this->handleException($e);
        }
    }

    /**
     * Retrieve all DayWeek records.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(): \Illuminate\Http\JsonResponse
    {
        try {
            $records = $this->model::all();
            return $this->successResponse($records, 'retrieved');
        } catch (\Exception $e) {
            return $this->handleException($e);
        }
    }

    // Define resource name for messages
    protected string $resourceName = 'Day of Week';

    // Methods provided by CrudOperations trait
}