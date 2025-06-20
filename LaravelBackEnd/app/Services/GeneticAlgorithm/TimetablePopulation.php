<?php

namespace App\Services\GeneticAlgorithm;

use Illuminate\Support\Collection;

class TimetablePopulation
{
    /** @var TimetableChromosome[] */
    public array $chromosomes = [];

    public function __construct(array $chromosomes = [])
    {
        $this->chromosomes = $chromosomes;
    }

    public function addChromosome(TimetableChromosome $chromosome): void
    {
        $this->chromosomes[] = $chromosome;
    }

    public function getChromosomes(): array
    {
        return $this->chromosomes;
    }

    public function sortByFitness(): void
    {
        usort($this->chromosomes, function ($a, $b) {
            return $b->getFitness() <=> $a->getFitness(); // الأعلى أولاً
        });
    }

    /**
     * توليد جيل جديد باستخدام التزاوج (crossover) والتحوير (mutation)
     */
    public function evolve(int $eliteCount, float $mutationRate): self
    {
        $this->sortByFitness();

        $newPopulation = [];

        // احتفاظ بأفضل الكروموسومات (النخبة)
        for ($i = 0; $i < $eliteCount; $i++) {
            $newPopulation[] = $this->chromosomes[$i]->clone();
        }

        // توليد الباقي بالتزاوج
        while (count($newPopulation) < count($this->chromosomes)) {
            $parent1 = $this->selectParent();
            $parent2 = $this->selectParent();

            $child = $this->crossover($parent1, $parent2);

            if (mt_rand() / mt_getrandmax() < $mutationRate) {
                $this->mutate($child);
            }

            $newPopulation[] = $child;
        }

        return new self($newPopulation);
    }

    private function selectParent(): TimetableChromosome
    {
        // اختيار عشوائي من أفضل نصف السكان
        $half = array_slice($this->chromosomes, 0, (int)(count($this->chromosomes) / 2));
        return $half[array_rand($half)];
    }

    private function crossover(TimetableChromosome $parent1, TimetableChromosome $parent2): TimetableChromosome
    {
        $genes1 = $parent1->getGenes();
        $genes2 = $parent2->getGenes();
        $length = count($genes1);
        $crossoverPoint = rand(1, $length - 2);

        $newGenes = array_merge(
            array_slice($genes1, 0, $crossoverPoint),
            array_slice($genes2, $crossoverPoint)
        );

        return new TimetableChromosome($newGenes);
    }

    private function mutate(TimetableChromosome $chromosome): void
    {
        $genes = $chromosome->getGenes();
        $index = array_rand($genes);
        $swapWith = array_rand($genes);

        // تبديل بين جينين
        $temp = $genes[$index];
        $genes[$index] = $genes[$swapWith];
        $genes[$swapWith] = $temp;

        $chromosome->genes = $genes;
    }
}
