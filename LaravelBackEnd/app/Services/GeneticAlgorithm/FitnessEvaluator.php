<?php

namespace App\Services\GeneticAlgorithm;

use Illuminate\Support\Facades\Log;

class FitnessEvaluator
{
    public function evaluate(TimetableChromosome $chromosome): int
    {
        $fitness = 0;
        $profSlotMap = [];
        $roomSlotMap = [];
        $profDailyCount = [];

        foreach ($chromosome->getGenes() as $gene) {
            $slotKey = $gene->dayId . '_' . $gene->timeSlotId;

            // لا يوجد أستاذ بنفس الوقت
            $profKey = $slotKey . '_' . $gene->professorId;
            if (!isset($profSlotMap[$profKey])) {
                $profSlotMap[$profKey] = true;
                $fitness += 10;
            } else {
                $fitness -= 20;
            }

            // لا توجد قاعة بنفس الوقت
            $roomKey = $slotKey . '_' . $gene->roomId;
            if (!isset($roomSlotMap[$roomKey])) {
                $roomSlotMap[$roomKey] = true;
                $fitness += 10;
            } else {
                $fitness -= 20;
            }

            // احترام الحد اليومي للأستاذ
            $dailyKey = $gene->professorId . '_' . $gene->dayId;
            $profDailyCount[$dailyKey] = ($profDailyCount[$dailyKey] ?? 0) + 1;
        }

        // تطبيق الحد اليومي للحصص
        foreach ($profDailyCount as $key => $count) {
            [$profId, $dayId] = explode('_', $key);

            // ❗ هنا يجب استدعاء الحد من قاعدة البيانات
            $limit = \App\Models\Professeur::where('MatriculePR', $profId)->value('daily_hours_limit') ?? 4;

            if ($count <= $limit) {
                $fitness += 10;
            } else {
                $fitness -= 15 * ($count - $limit); // خصم عن كل حصة زائدة
            }
        }

        // مكافأة للجلسات المتجاورة
        $groupedByProfDay = [];

        foreach ($chromosome->getGenes() as $gene) {
            $key = $gene->professorId . '_' . $gene->dayId;
            $groupedByProfDay[$key][] = $gene->timeSlotId;
        }

        foreach ($groupedByProfDay as $slots) {
            sort($slots);
            for ($i = 1; $i < count($slots); $i++) {
                Log::info(''. $slots[$i]);
                if ($slots[$i] == $slots[$i - 1] + 1) {
                    $fitness += 5; // حصتين متتاليتين
                }
            }
        }

        $chromosome->setFitness($fitness);
        return $fitness;
    }
}
