import { useFetchData, usePostData } from '../../../api/queryHooks';
import { useEffect, useState } from 'react';
import { commonValidations, generateField } from '../utils/formUtils';
import { useFormOptions } from '../utils/hooks';

export const getFormStepsEp = (formContext, row) => {
    const {
      TYPE: { SELECT, TEXT, DATE, TEXTAREA, EMAIL, PHONE, IMAGE, NUMBER, AUTO_COMPLETE_SELECT, MULTI_SELECT }
    } = useFormOptions();

    const [evaluationsData, setEvaluationsData] = useState([]);
    const [evaluationsLoading, setEvaluationsLoading] = useState(false);
    const [evaluationsError, setEvaluationsError] = useState(null);
    const { data: evaluationsDT, isLoading: evaluationsLD, error: evaluationsER } = useFetchData(
        "evaluation-types"
    );

    useEffect(() => setEvaluationsData(evaluationsDT), [evaluationsDT]);
    useEffect(() => setEvaluationsLoading(evaluationsLD), [evaluationsLD]);
    useEffect(() => setEvaluationsError(evaluationsER), [evaluationsER]);
    useEffect(() => {
      // مثال: افترض أن لديك بيانات `row` متاحة
      if (row) {
        setEvaluationsData(prev =>
          Array.isArray(prev)
            ? prev.filter(ev => !(ev.NameEP === row.NameEP && ev.CodeEP === row.CodeEP))
            : evaluationsDT?.data?.filter(ev => !(ev.NameEP === row.NameEP && ev.CodeEP === row.CodeEP)) || []
        );
      }
    }, [row]);

    // Validation to ensure unique evaluation names and codes
    function NameValidation(value) {
        if (!value || value.trim() === "") {
            return "Le nom ne peut pas être vide.";
        }
        if (evaluationsData?.data?.map(ev => ev.NameEP)?.includes(value.trim())) {
            return "Ce nom est déjà utilisé.";
        }
        return true;
    }

    function CodeValidation(value) {
        if (!value || value.trim() === "") {
            return "Le code ne peut pas être vide.";
        }
        if (evaluationsData?.data?.map(ev => ev.CodeEP)?.includes(value.trim())) {
            return "Ce code est déjà utilisé.";
        }
        return true;
    }

    return [
        {
            title: "General Information",
            Fields: [
                generateField({
                    type: TEXT,
                    label: "NameEP",
                    propsType: "text",
                    propsLabel: "Nom",
                    enablePlaceholder: true,
                    validation: commonValidations.combine(
                        commonValidations.required("Nom"),
                        commonValidations.pattern(
                            "Nom",
                            /^[A-Za-z0-9]+(?:[-\s][A-Za-z0-9]+)*$/,
                            `Nom doit commencer par une lettre majuscule, contenir uniquement des noms valides et avoir un seul espace entre les mots.`
                        ),
                        { validate: NameValidation }
                    )
                }),
                generateField({
                    type: TEXT,
                    label: "CodeEP",
                    propsType: "text",
                    propsLabel: "Code",
                    enablePlaceholder: true,
                    validation: commonValidations.combine(
                        commonValidations.required("Code"),
                        commonValidations.pattern(
                            "Code",
                            /^[A-ZZa-z0-9]+(?:[-\s][A-ZZa-z0-9]+)*$/,
                            `Code doit commencer par une lettre majuscule, contenir uniquement des noms valides et avoir un seul espace entre les mots.`
                        ),
                        { validate: CodeValidation }
                    )
                }),
                generateField({
                    type: TEXTAREA,
                    propsLabel: "Description",
                    label: "DescriptionEP",
                    enablePlaceholder: true,
                    extraProps: { maxLength: 321, rows: 3 },
                    validation: commonValidations.combine(
                        commonValidations.maxLength("Description", 321),
                        commonValidations.minLength("Description", 0)
                    )
                })
            ]
        },
        {
            title: "Grade Details",
            Fields: [
                generateField({
                    type: TEXT,
                    label: "MaxGradeEP",
                    propsType: "number",
                    propsLabel: "Max Grade",
                    enablePlaceholder: true,
                    validation: commonValidations.combine(
                        commonValidations.required("Max Grade"),
                        {
                            validate: (value) => value > 0
                                ? true
                                : 'Error: Value must be a number greater than 0.'
                        }
                    )
                }),
                generateField({
                    type: TEXT,
                    label: "PorsentageEP",
                    propsType: "number",
                    propsLabel: "Pourcentage",
                    enablePlaceholder: true,
                    validation: commonValidations.combine(
                        commonValidations.required("Pourcentage"),
                        {
                            validate: (value) => value >= 0 && value <= 100
                                ? true
                                : 'Error: Value must be a number between 0 and 100.'
                        }
                    )
                })
            ]
        }
    ];
};