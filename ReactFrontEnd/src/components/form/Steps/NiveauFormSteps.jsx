import { useFormOptions } from '../utils/hooks';

import { commonValidations, generateField } from '../utils/formUtils';
import { useFetchData } from '../../../api/queryHooks';
import { useEffect, useState } from 'react';
export const getFormStepsNv = (formContext, row) => {
    const {
      TYPE: { SELECT, TEXT, DATE, TEXTAREA, EMAIL, PHONE, IMAGE, NUMBER, AUTO_COMPLETE_SELECT, MULTI_SELECT }
    } = useFormOptions();
    const [NamesData,setNamesData] = useState([]);
    const { data: NamesDT } = useFetchData("getallniveauxnames");
    useEffect(()=>setNamesData(NamesDT || []),[NamesDT]);

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
            title: "Niveau",
            Fields: [
                generateField({
                    type: TEXT,
                    label: "NomNV",
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
                        ),
                        {validate: NamesValidation}
                      )
                  }), 
                generateField({
                    type: TEXT,
                    label: "CodeNV",
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
                    type: TEXTAREA,
                    label: "DescriptionNV",
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