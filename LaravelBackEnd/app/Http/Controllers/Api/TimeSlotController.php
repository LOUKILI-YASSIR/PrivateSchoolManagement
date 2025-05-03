<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Traits\CrudOperations;
use App\Models\TimeSlot;
use Illuminate\Http\Request;

class TimeSlotController extends Controller
{
    use CrudOperations;

    protected string $model = TimeSlot::class;

    protected array $validationRules = [
        // Assuming HH:MM:SS format
        'StartTimeTS' => 'required|date_format:H:i:s',
        'EndTimeTS' => 'required|date_format:H:i:s|after:StartTimeTS',
    ];

    // Define resource name for messages
    protected string $resourceName = 'Time Slot';

    // Methods provided by CrudOperations trait
}
