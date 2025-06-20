import { useFetchData } from '../../../api/queryHooks';
import { useMemo, useCallback, useEffect } from 'react';
import { commonValidations, generateField } from '../utils/formUtils';
import { useFormOptions } from '../utils/hooks';

export const getFormStepsGp = (formContext, row) => {
  const {
    TYPE: { SELECT, TEXT, TEXTAREA, MULTI_SELECT }
  } = useFormOptions();
  const { isSubmitting } = formContext;
//  const { data: FormDT, isLoading: FormLD, error: FormER } = useFetchData("getfromgroups" + (row?.MatriculeGP ? "/" + row?.MatriculeGP : ""));
  const { data: FormDT, isLoading: FormLD, error: FormER, refetch } = useFetchData("getfromgroups" + (row?.MatriculeGP ? "/" + row?.MatriculeGP : ""));
  useEffect(()=>{if(isSubmitting) refetch();},[isSubmitting])
  const niveauxOptions = useMemo(() => {
    if (FormLD || FormER || !FormDT?.niveaux) return [];
    return FormDT.niveaux.map(niveau => ({
      value: niveau.MatriculeNV,
      label: niveau.NomNV + (niveau.parent?.NomNV ? ` (${niveau.parent?.NomNV})` : "")
    }));
  }, [FormDT, FormLD, FormER]);

  const nomsFiltered = useMemo(() => {
    if (!FormDT?.groupNames) return [];
    return FormDT.groupNames.filter(n => n !== row?.NameGP);
  }, [FormDT, row]);

  const NamesValidation = useCallback((value) => {
    if (!value || value.trim() === "") return "Le nom ne peut pas être vide.";
    if (nomsFiltered.includes(value.trim())) return "Ce nom est déjà utilisé.";
    return true;
  }, [nomsFiltered]);

  const studentsOptions = useMemo(() => {
    return FormDT?.etudiants?.map(e => ({
      value: e.MatriculeET,
      label: e.FullNameET
    })) || [];
  }, [FormDT]);

  const selectedStudents = useMemo(() => {
    return row?.etudiants?.map(e => e.MatriculeET)
      || FormDT?.selectedET?.map(e => e.MatriculeET)
      || [];
  }, [FormDT, row]);

  const professeursOptions = useMemo(() => {
    return FormDT?.professeurs?.map(p => ({
      value: p.MatriculePR,
      label: p.FullNamePR
    })) || [];
  }, [FormDT]);

  const selectedProfesseurs = useMemo(() => {
    return row?.professeurs?.map(p => p.MatriculePR)
      || FormDT?.selectedPR?.map(p => p.MatriculePR)
      || [];
  }, [FormDT, row]);

  return [
    {
      title: "General",
      Fields: [
        generateField({
          type: TEXT,
          label: "NameGP",
          propsType: "text",
          propsLabel: "Group Name",
          enablePlaceholder: true,
          validation: commonValidations.combine(
            commonValidations.required("Group Name"),
            commonValidations.maxLength("Group Name", 255),
            commonValidations.pattern(
              "Nom",
              /^([A-Z][a-z]+[0-9]*)(?:-[A-Z][a-z]+)*(?:\s[A-Z][a-z]+[0-9]*(?:-[A-Z][a-z]+)*)*$/,
              `chaque mot doit commencer par une majuscule, peut contenir des chiffres à la fin...`
            ),
            { validate: NamesValidation }
          )
        }),
        generateField({
          type: TEXTAREA,
          label: "DescriptionGP",
          propsLabel: "Description",
          enablePlaceholder: true,
          extraProps: { maxLength: 500, rows: 4 },
          validation: commonValidations.maxLength("Description", 500)
        })
      ]
    },
    {
      title: "Scolaire",
      Fields: [
        generateField({
          type: SELECT,
          label: "MatriculeNV",
          propsLabel: "Level",
          options: niveauxOptions,
          validation: commonValidations.required("Level")
        }),
        generateField({
          type: MULTI_SELECT,
          label: "Etudiants",
          propsLabel: "Students",
          options: studentsOptions,
          value: selectedStudents,
          validation: commonValidations.optionalArray("Students", {
            validate: (value) =>
              value.every(id => studentsOptions.some(s => s.value === id)) ||
              "All selected students must exist"
          })
        }),
        generateField({
          type: MULTI_SELECT,
          label: "Professeurs",
          propsLabel: "Professeurs",
          options: professeursOptions,
          value: selectedProfesseurs,
          validation: commonValidations.optionalArray("Professeurs", {
            validate: (value) =>
              value.every(id => professeursOptions.some(p => p.value === id)) ||
              "All selected professeurs must exist"
          })
        })
      ]
    }
  ];
};
