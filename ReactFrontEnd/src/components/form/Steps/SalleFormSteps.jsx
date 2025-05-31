import { useFormOptions } from '../utils/hooks';

import { commonValidations, generateField } from '../utils/formUtils';
import { useState, useEffect } from 'react';
import { useFetchData } from '../../../api/queryHooks';
export const getFormStepsSl = (formContext, row) => {
    const {
      TYPE: { SELECT, TEXT, DATE, TEXTAREA, EMAIL, PHONE, IMAGE, NUMBER, AUTO_COMPLETE_SELECT }
    } = useFormOptions();
    const salleStatuses = [
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
    const [NamesData, setNamesData] = useState({});
    const [NamesLoading, setNamesLoading] = useState(false);
    const { data: NamesDT, isLoading: NamesLD } = useFetchData("getallsallesnames");

    useEffect(() => setNamesData(NamesDT), [NamesDT]);
    useEffect(() => setNamesLoading(NamesLD), [NamesLD]);
    let FilteredNamesData = null;
    if (row && typeof row === "object" && NamesData) {
      FilteredNamesData = {
        noms: NamesData.noms?.filter(nom => nom !== row.NameSL) || [],
      };
    }
    function NamesValidation (value) {
      if (!value || value.trim() === "") {
        return "Le nom ne peut pas être vide.";
      }
      if (FilteredNamesData) {
        if(FilteredNamesData.noms.includes(value.trim())) {
          return "Ce nom est déjà utilisé.";
        }
      }else if (NamesData && NamesData?.noms && NamesData?.noms?.includes(value.trim())) {
        return "Ce nom est déjà utilisé.";
      }
      return true;
    }
    return [
        {
            title: "Salle",
            Fields: [
                generateField({
                    type: TEXT,
                    label: "NameSL",
                    propsType: "text",
                    propsLabel: "Nom",
                    enablePlaceholder: true,
                    validation: commonValidations.combine(
                        commonValidations.required("Nom"),
                        commonValidations.pattern(
                          "Nom",
                          // Pattern: starts with a capital letter, then lowercase letters; allows hyphenated parts and multiple words.
                          /^([A-Z][a-z]+[0-9]*)(?:-[A-Z][a-z]+)*(?:\s[A-Z][a-z]+[0-9]*(?:-[A-Z][a-z]+)*)*$/,
                          `chaque mot doit commencer par une majuscule, peut contenir des chiffres à la fin (pas après un tiret), et peut être composé avec des tirets ou séparé par des espaces. Exemples valides : Jean, Jean3, Jean-Pierre, Jean3 Dupont2.`
                        ),
                        {validate: NamesValidation}
                      )
                  }), 
                generateField({
                    type: TEXT,
                    label: "LocationSL",
                    propsType: "text",
                    propsLabel: "Localisation",
                    enablePlaceholder: true,
                    validation: commonValidations.combine(
                        commonValidations.minLength(5, "Localisation"),
                      )
                  }), 
                generateField({
                    type: TEXT,
                    label: "TypeSL",
                    propsType: "text",
                    propsLabel: "Type",
                    enablePlaceholder: true,
                    validation: commonValidations.combine(
                        commonValidations.required("Type"),
                        commonValidations.pattern(
                          "Type",
                          // Pattern: starts with a capital letter, then lowercase letters; allows hyphenated parts and multiple words.
                          /^([A-Z][a-z]+(?:-[A-Z][a-z]+)?)(\s[A-Z][a-z]+(?:-[A-Z][a-z]+)?)*$/,
                          `Type doit commencer par une lettre majuscule, contenir uniquement des noms valides et avoir un seul espace entre les mots.`
                        )
                      )
                }), 
                generateField({
                  type: SELECT,
                  label: 'StatusSL',
                  propsLabel: "Status",
                  options: salleStatuses.map(salleStatus=>({label:salleStatus,value:salleStatus})),
                  classes:" mt-5",
                  validation: commonValidations.combine(
                    commonValidations.required("Status"),
                    commonValidations.inArray("Status", salleStatuses, "Status doit être " + salleStatuses.join(", "))
                  )
                }),
                generateField({
                    type: TEXT,
                    label: "CapacitySL",
                    propsType: "number",
                    propsLabel: "Capacity",
                    enablePlaceholder: true,
                    validation: commonValidations.combine(
                        commonValidations.required("Capacity"),
                        { 
                            validate: (value, context) => value > 0 ?
                                        true : 'Error: Value must be a number greater than 0.'
                          },
                      )
                  }), 
                generateField({
                    type: TEXT,
                    label: "FloorSL",
                    propsType: "number",
                    propsLabel: "Floor",
                    enablePlaceholder: true,
                  }),
                  generateField({
                    type: TEXTAREA,
                    propsLabel: 'Ressources',
                    label: "RessourcesSL",
                    enablePlaceholder: true,
                    extraProps: { maxLength: 321, rows: 3 },
                    validation: commonValidations.combine(
                      commonValidations.maxLength('Ressources', 321),
                      commonValidations.minLength('Ressources', 5)
                    )
                  }), 
                  generateField({
                    type: TEXTAREA,
                    propsLabel: 'Observation',
                    label: "ObservationSL",
                    enablePlaceholder: true,
                    extraProps: { maxLength: 321, rows: 3 },
                    validation: commonValidations.combine(
                      commonValidations.maxLength('Observation', 321),
                      commonValidations.minLength('Observation', 0)
                    )
                  }), 
                  
            ]
        },
    ];
};