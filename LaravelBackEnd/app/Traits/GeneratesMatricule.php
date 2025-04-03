<?php

namespace App\Traits;

trait GeneratesMatricule
{
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->{$model->getKeyName()})) {
                $prefix = static::getMatriculePrefix();
                $year = date('Y');
                $count = static::count() + 1;
                $model->{$model->getKeyName()} = "YLSCHOOL_{$year}_{$prefix}_" . str_pad($count, 5, '0', STR_PAD_LEFT);
            }
        });
    }

    protected static function getMatriculePrefix()
    {
        return 'GEN';
    }
} 