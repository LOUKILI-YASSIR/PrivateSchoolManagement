import { useFormOptions } from '../utils/hooks';

import { commonValidations, generateField } from '../utils/formUtils';
export const getFormStepsEp = () => {
    const {
      TYPE: { SELECT, TEXT, DATE, TEXTAREA, EMAIL, PHONE, IMAGE, NUMBER, AUTO_COMPLETE_SELECT }
    } = useFormOptions();
    return [
        {
            title: "Evaluation",
            Fields: [
                generateField({
                    type: TEXT,
                    label: "nameSl",
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
                    label: "codeEp",
                    propsType: "text",
                    propsLabel: "Code",
                    enablePlaceholder: true,
                    validation: commonValidations.combine(
                        commonValidations.required("Code"),
                        commonValidations.pattern(
                          "Code",
                          // Pattern: starts with a capital letter, then lowercase letters; allows hyphenated parts and multiple words.
                          /^([A-Z][a-z]+(?:-[A-Z][a-z]+)?)(\s[A-Z][a-z]+(?:-[A-Z][a-z]+)?)*$/,
                          `Code doit commencer par une lettre majuscule, contenir uniquement des noms valides et avoir un seul espace entre les mots.`
                        )
                      )
                  }), 
                generateField({
                    type: TEXT,
                    label: "maxGradeEp",
                    propsType: "number",
                    propsLabel: "Max Grade",
                    enablePlaceholder: true,
                    validation: commonValidations.combine(
                        commonValidations.required("Type"),
                        { 
                            validate: (value, context) => value > 0 ?
                                        true : 'Error: Value must be a number greater than 0.'
                        },
                    ),
                }), 
                generateField({
                    type: TEXT,
                    label: "porsentageEp",
                    propsType: "number",
                    propsLabel: "Porsentage",
                    enablePlaceholder: true,
                    validation: commonValidations.combine(
                        commonValidations.required("Porsentage"),
                        { 
                            validate: (value, context) => value > 0 && value < 101 ?
                                        true : 'Error: Value must be a number greater than 0 and less than 101.'
                        },
                    ),
                }), 
                  generateField({
                    type: TEXTAREA,
                    propsLabel: 'Description',
                    label: "descriptionEp",
                    enablePlaceholder: true,
                    extraProps: { maxLength: 321, rows: 3 },
                    validation: commonValidations.combine(
                      commonValidations.maxLength('Description', 321),
                      commonValidations.minLength('Description', 0)
                    )
                  }), 
                  
            ]
        },
    ];
};