<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Traits\CrudOperations;
use App\Models\TimeTableException;
use Illuminate\Http\Request;

class TimeTableExceptionController extends Controller
{
    use CrudOperations;

    protected string $model = TimeTableException::class;

    protected array $validationRules = [
        'exceptionTypeTe' => 'required|string|max:255',
        'exceptionDateTe' => 'required|date',
        'isFulldayTe' => 'sometimes|boolean',
        'matriculeTs' => 'required|string|exists:time_slots,matriculeTs',
        'reasonTe' => 'nullable|string',
        'newMatriculeTs' => 'nullable|string|exists:time_slots,matriculeTs',
    ];

    // Define resource name for messages
    protected string $resourceName = 'Time Table Exception';

    // Methods provided by CrudOperations trait
}
