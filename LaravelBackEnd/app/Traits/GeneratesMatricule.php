<?php

namespace App\Traits;

use Illuminate\Support\Str;

trait GeneratesMatricule
{
    protected static function bootGeneratesMatricule()
    {
        static::creating(function ($model) {
            if (empty($model->{$model->getKeyName()})) {
                $model->{$model->getKeyName()} = static::generateUniqueMatricule($model);
            }
        });
    }

    protected static function getMatriculePrefix()
    {
        return 'GEN'; // You can override this method in the model
    }

    protected static function generateUniqueMatricule($model): string
    {
        $prefix = static::getMatriculePrefix();
        $year = date('Y');
        $fullPrefix = "YLSCHOOL_{$year}_{$prefix}_";

        // Get all existing matricule numbers
        $existingNumbers = static::where($model->getKeyName(), 'LIKE', $fullPrefix . '%')
            ->pluck($model->getKeyName())
            ->map(function ($matricule) use ($fullPrefix) {
                return (int) str_replace($fullPrefix, '', $matricule);
            })
            ->sort()
            ->values();

        // Find the first available gap
        $newNumber = 1;
        foreach ($existingNumbers as $number) {
            if ($number != $newNumber) {
                break;
            }
            $newNumber++;
        }

        // Return the new unique matricule
        return $fullPrefix . str_pad($newNumber, 6, '0', STR_PAD_LEFT);
    }
}
