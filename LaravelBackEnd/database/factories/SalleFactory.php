<?php

namespace Database\Factories;

use App\Models\AcademicYear;
use App\Models\Salle;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Salle>
 */
class SalleFactory extends Factory
{
    protected $model = Salle::class;
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $salleStatuses = [
          "disponible",         // القاعة متاحة للاستخدام ولا يوجد بها حجز أو نشاط
          "occupée",            // القاعة مشغولة حاليًا بحصة أو نشاط
          "réservée",           // القاعة محجوزة لحصة أو نشاط قادم
          "en_maintenance",     // القاعة تحت الصيانة أو غير صالحة مؤقتًا للاستخدام
          "fermée",             // القاعة مغلقة بشكل مؤقت أو دائم ولا يمكن استخدامها
          "en_nettoyage",       // القاعة قيد التنظيف ولا يمكن استخدامها حالياً
          "mode_examen",        // القاعة مخصصة للامتحانات فقط ولا يمكن استخدامها لحصص عادية
          "événement",          // القاعة مستخدمة لنشاط أو فعالية خاصة
          "non_attribuée"       // القاعة لم يتم تخصيص حالة لها بعد (حالة افتراضية أو غير معروفة)
        ];


        return [
            // 'MatriculeSL' is handled by the GeneratesMatricule trait
            'NameSL' => 'Salle ' . $this->faker->unique()->word() . ' ' . $this->faker->randomNumber(2),
            'CapacitySL' => $this->faker->numberBetween(20, 100),
            'LocationSL' => $this->faker->optional()->word(), // e.g., Building A, Block C
            'RessourcesSL' => $this->faker->optional()->sentence(3),
            'TypeSL' => $this->faker->randomElement(['Classroom', 'Lab', 'Amphitheater', 'Meeting Room']),
            'StatusSL' => $this->faker->randomElement($salleStatuses),
            'FloorSL' => $this->faker->optional()->randomDigitNotNull(),
            'ObservationSL' => $this->faker->optional()->paragraph(),
            'MatriculeYR' => AcademicYear::factory()
        ];
    }
}
