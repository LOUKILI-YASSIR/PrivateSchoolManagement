import { useFormOptions } from '../utils/hooks';

import { commonValidations, generateField } from '../utils/formUtils';
export const getFormStepsSl = () => {
    const {
      TYPE: { SELECT, TEXT, DATE, TEXTAREA, EMAIL, PHONE, IMAGE, NUMBER, AUTO_COMPLETE_SELECT }
    } = useFormOptions();
    return [
        {
            title: "Salle",
            Fields: [
                generateField({
                    type: TEXT,
                    label: "NameSl",
                    propsType: "text",
                    propsLabel: "Nom",
                    enablePlaceholder: true,
                    validation: commonValidations.combine(
                        commonValidations.required("Nom"),
                        commonValidations.pattern(
                          "Nom",
                          // Pattern: starts with a capital letter, then lowercase letters; allows hyphenated parts and multiple words.
                          /^([A-Z][a-z]+(?:-[A-Z][a-z]+)?)(\s[A-Z][a-z]+(?:-[A-Z][a-z]+)?)*$/,
                          `Nom doit commencer par une lettre majuscule, contenir uniquement des noms valides et avoir un seul espace entre les mots.`
                        )
                      )
                  }), 
                generateField({
                    type: TEXT,
                    label: "LocationSl",
                    propsType: "text",
                    propsLabel: "Localisation",
                    enablePlaceholder: true,
                    validation: commonValidations.combine(
                        commonValidations.required("Localisation"),
                        commonValidations.pattern(
                          "Localisation",
                          // Pattern: starts with a capital letter, then lowercase letters; allows hyphenated parts and multiple words.
                          /^([A-Z][a-z]+(?:-[A-Z][a-z]+)?)(\s[A-Z][a-z]+(?:-[A-Z][a-z]+)?)*$/,
                          `Localisation doit commencer par une lettre majuscule, contenir uniquement des noms valides et avoir un seul espace entre les mots.`
                        )
                      )
                  }), 
                generateField({
                    type: TEXT,
                    label: "typeSl",
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
                    type: TEXT,
                    label: "CapacitySl",
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
                    label: "floorSl",
                    propsType: "text",
                    propsLabel: "Floor",
                    enablePlaceholder: true,
                    validation: commonValidations.combine(
                        commonValidations.required("Floor"),
                        commonValidations.pattern(
                          "Floor",
                          // Pattern: starts with a capital letter, then lowercase letters; allows hyphenated parts and multiple words.
                          /^([A-Z][a-z]+(?:-[A-Z][a-z]+)?)(\s[A-Z][a-z]+(?:-[A-Z][a-z]+)?)*$/,
                          `Floor doit commencer par une lettre majuscule, contenir uniquement des noms valides et avoir un seul espace entre les mots.`
                        )
                      )
                  }),
                  generateField({
                    type: TEXTAREA,
                    propsLabel: 'Ressources',
                    label: "ressourcesSl",
                    enablePlaceholder: true,
                    extraProps: { maxLength: 321, rows: 3 },
                    validation: commonValidations.combine(
                      commonValidations.required('Ressources'),
                      commonValidations.maxLength('Ressources', 321),
                      commonValidations.minLength('Ressources', 5)
                    )
                  }), 
                  generateField({
                    type: TEXTAREA,
                    propsLabel: 'Observation',
                    label: "observationSl",
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