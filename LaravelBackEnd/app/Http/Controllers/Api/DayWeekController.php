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

    // Define resource name for messages
    protected string $resourceName = 'Day of Week';

    // Methods provided by CrudOperations trait
}
