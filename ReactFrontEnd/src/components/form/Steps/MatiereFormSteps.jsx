import { useFormOptions } from '../utils/hooks';

import { commonValidations, generateField } from '../utils/formUtils';
import { useFetchData } from '../../../api/queryHooks';
export const getFormStepsMt = () => {
    const {
      TYPE: { SELECT, TEXT, DATE, TEXTAREA, EMAIL, PHONE, IMAGE, NUMBER, AUTO_COMPLETE_SELECT }
    } = useFormOptions();
    const { data, isLoading, error } = useFetchData("niveaux");
    return [
        {
            title: "Matiere",
            Fields: [
                generateField({
                    type: TEXT,
                    label: "nameMt",
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
                    label: "codeMt",
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
                    label: "coefficientMt",
                    propsType: "number",
                    propsLabel: "Coefficient",
                    enablePlaceholder: true,
                    validation: commonValidations.combine(
                        commonValidations.required("Coefficient"),
                        { 
                            validate: (value, context) => value > 0 ?
                                        true : 'Error: Value must be a number greater than 0.'
                          },
                      )
                  }), 
                  generateField({
                    type: SELECT,
                    label: 'matriculeNv',
                    propsLabel: "Niveaux",
                    options: (isLoading || error || !data || data?.data?.length === 0
                      ? [] // Fallback to empty array if data is not ready
                      : data?.data.map((niveau) => ({
                          value: niveau.matriculeNv,
                          label: niveau.NomNv+(niveau.parent?.NomNv ? ` (${niveau.parent?.NomNv})` : ""),
                      }))),
                    validation: commonValidations.required("Niveaux")
                  }),
                generateField({
                    type: TEXTAREA,
                    label: "descriptionMt",
                    propsType: "text",
                    propsLabel: "Description",
                    enablePlaceholder: true,
                    validation: commonValidations.combine(
                        commonValidations.required("Description"),
                        commonValidations.maxLength("Description", 500)
                      )
                  }),

            ]
        },
    ];
};