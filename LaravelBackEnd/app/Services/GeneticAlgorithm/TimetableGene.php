<?php

namespace App\Services\GeneticAlgorithm;

class TimetableGene
{
    public $groupId;
    public $dayId;
    public $timeSlotId;
    public $professorId;
    public $roomId;
    public $matiereId;

    public function __construct($groupId, $dayId, $timeSlotId, $professorId, $roomId, $matiereId)
    {
        $this->groupId = $groupId;
        $this->dayId = $dayId;
        $this->timeSlotId = $timeSlotId;
        $this->professorId = $professorId;
        $this->roomId = $roomId;
        $this->matiereId = $matiereId;
    }

    public function toArray()
    {
        return [
            'MatriculeGP' => $this->groupId,
            'MatriculeDW' => $this->dayId,
            'MatriculeTS' => $this->timeSlotId,
            'MatriculePR' => $this->professorId,
            'MatriculeSL' => $this->roomId,
            'MatriculeMT' => $this->matiereId,
        ];
    }
}
