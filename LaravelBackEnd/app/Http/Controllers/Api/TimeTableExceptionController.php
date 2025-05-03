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
        'ExceptionTypeTE' => 'required|string|max:255',
        'ExceptionDateTE' => 'required|date',
        'IsFulldayTE' => 'sometimes|boolean',
        'MatriculeTS' => 'required|string|exists:time_slots,MatriculeTS',
        'ReasonTE' => 'nullable|string',
        'NewMatriculeTS' => 'nullable|string|exists:time_slots,MatriculeTS',
    ];

    // Define resource name for messages
    protected string $resourceName = 'Time Table Exception';

    // Methods provided by CrudOperations trait
}
