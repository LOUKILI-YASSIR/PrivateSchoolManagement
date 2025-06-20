<?php

namespace App\Http\Controllers;

use App\Models\DayWeek;
use App\Models\TimeSlot;
use App\Models\RegularTimeTable;
use App\Models\SchoolCalendar;
use App\Models\SpecialDaySchedule;
use App\Models\SchoolEvent;
use App\Models\TimeTableException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class TimeTableController extends Controller
{
    public function getgroups(){
        return response()->json(\App\Models\Group::all());
    }



    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'day' => 'required|string',
            'time_slot' => 'required|string',
            'subject' => 'required|string',
            'teacher' => 'required|string',
            'group' => 'required|string',
            'room' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $timeTable = RegularTimeTable::create([
            'day' => $request->day,
            'time_slot' => $request->time_slot,
            'subject' => $request->subject,
            'teacher_id' => $request->teacher,
            'group_id' => $request->group,
            'room_id' => $request->room,
        ]);

        return response()->json($timeTable, 201);
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'day' => 'required|string',
            'time_slot' => 'required|string',
            'subject' => 'required|string',
            'teacher' => 'required|string',
            'group' => 'required|string',
            'room' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $timeTable = RegularTimeTable::findOrFail($id);
        $timeTable->update([
            'day' => $request->day,
            'time_slot' => $request->time_slot,
            'subject' => $request->subject,
            'teacher_id' => $request->teacher,
            'group_id' => $request->group,
            'room_id' => $request->room,
        ]);

        return response()->json($timeTable);
    }

    public function updatePosition(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'source' => 'required|array',
            'destination' => 'required|array',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        DB::transaction(function () use ($request) {
            $sourceKey = $request->source['day'] . '-' . $request->source['time_slot'];
            $destKey = $request->destination['day'] . '-' . $request->destination['time_slot'];

            $sourceItem = RegularTimeTable::where('day', $request->source['day'])
                ->where('time_slot', $request->source['time_slot'])
                ->first();

            $destItem = RegularTimeTable::where('day', $request->destination['day'])
                ->where('time_slot', $request->destination['time_slot'])
                ->first();

            if ($sourceItem) {
                $sourceItem->update([
                    'day' => $request->destination['day'],
                    'time_slot' => $request->destination['time_slot']
                ]);
            }

            if ($destItem) {
                $destItem->update([
                    'day' => $request->source['day'],
                    'time_slot' => $request->source['time_slot']
                ]);
            }
        });

        return response()->json(['message' => 'Position updated successfully']);
    }

    public function destroy($id)
    {
        $timeTable = RegularTimeTable::findOrFail($id);
        $timeTable->delete();
        return response()->json(null, 204);
    }

    public function getTimeTable()
    {
        $timeTable = RegularTimeTable::with(['teacher', 'group', 'room'])->get();
        return response()->json($timeTable);
    }
}
