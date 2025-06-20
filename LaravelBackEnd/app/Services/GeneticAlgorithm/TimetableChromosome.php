<?php

namespace App\Services\GeneticAlgorithm;

class TimetableChromosome
{
    /** @var TimetableGene[] */
    public array $genes = [];

    /** @var int|null */
    public ?int $fitnessScore = null;

    public function __construct(array $genes = [])
    {
        $this->genes = $genes;
    }

    public function addGene(TimetableGene $gene): void
    {
        $this->genes[] = $gene;
    }

    public function getGenes(): array
    {
        return $this->genes;
    }

    public function setFitness(int $score): void
    {
        $this->fitnessScore = $score;
    }

    public function getFitness(): ?int
    {
        return $this->fitnessScore;
    }

    public function shuffleGenes(): void
    {
        shuffle($this->genes);
    }

    public function clone(): TimetableChromosome
    {
        $clonedGenes = array_map(fn($gene) => new TimetableGene(
            $gene->groupId,
            $gene->dayId,
            $gene->timeSlotId,
            $gene->professorId,
            $gene->roomId,
            $gene->matiereId
        ), $this->genes);

        return new TimetableChromosome($clonedGenes);
    }
}
