import { useCallback, useEffect, useState } from "react";
import { useFormOptions } from "../utils/hooks";
import { useFetchData } from "../../../api/queryHooks";
import { commonValidations, generateField } from "../utils/formUtils";

export const getFormStepsMt = (formContext, row) => {
  const {
    TYPE: { SELECT, TEXT, TEXTAREA, MULTI_SELECT }
  } = useFormOptions();

  const { formMethods, isSubmitting } = formContext;
  const { watch } = formMethods;

  const [MatiereFormData, setMatiereFormData] = useState([]);
  const { data: matiereDT, refetch } = useFetchData(
        "getfrommatieres" + (row?.MatriculeMT ? "/" + row.MatriculeMT : "")
      );
    useEffect(()=>{if(isSubmitting) refetch();},[isSubmitting])
    useEffect(()=>{
        if(matiereDT){
            console.log(row,matiereDT)
            setMatiereFormData({
                ...(matiereDT || {}),
                professeurs:{
                    ...(matiereDT?.professeurs || {}),
                    selectedPR: matiereDT?.professeurs?.selectedPR?.map((p) => p.MatriculePR) ||
                    row?.professeurs?.map((p) => p.MatriculePR) ||
                    []
                },
                noms: (row ? matiereDT?.noms?.filter((n) => n !== row.NameMT) : matiereDT?.noms) || []
            });
        }
    },[matiereDT,row]);

  const FilteredNamesData =
    row && MatiereFormData?.noms
      ? { noms: MatiereFormData.noms.filter((n) => n !== row.NameMT) }
      : null;

  const NamesValidation = (value) => {
    if (!value || value.trim() === "") return "Le nom ne peut pas être vide.";
    const exists =
      FilteredNamesData?.noms?.includes(value.trim()) ||
      MatiereFormData?.noms?.includes(value.trim());
    return exists ? "Ce nom est déjà utilisé." : true;
  };

  const NbrEVMT = watch("NbrEVMT");
  const NbrEVFields = [];
  const MatriculeEPFields = [];

  for (let i = 0; i < 20; i++) {
    NbrEVFields.push(watch(`NbrEV_${i}`));
    MatriculeEPFields.push(watch(`MatriculeEP_${i}`));
  }

  const uniqueEP = [...new Set(MatriculeEPFields.filter(Boolean))];

   const totalPourcentage = [...Array(20).keys()].reduce((sum, i) => {
      const ep = watch(`MatriculeEP_${i}`);
      const nbr = Number(watch(`NbrEV_${i}`));
      const obj = MatiereFormData?.["evaluation-types"]?.find(
        (e) => e.MatriculeEP === ep
      );

      if (ep && obj && !isNaN(nbr)) {
        return sum + (obj.PorsentageEP * nbr);
      }

      return sum;
    }, 0);



  // Étape 1 : Infos matière
  const step1Fields = [
    generateField({
      type: TEXT,
      label: "NameMT",
      propsLabel: "Nom",
      value: row ? row.NameMT : "",
      enablePlaceholder: true,
      validation: commonValidations.combine(
        commonValidations.required("Nom"),
        commonValidations.pattern(
          "Nom",
          /^([A-Z][a-z]+(?:-[A-Z][a-z]+)?)(\s[A-Z][a-z]+(?:-[A-Z][a-z]+)?)*$/,
          `Nom invalide`
        ),
        { validate: NamesValidation }
      )
    }),
    generateField({
      type: TEXT,
      label: "CodeMT",
      value: row ? row.CodeMT : "",
      propsLabel: "Code",
      enablePlaceholder: true,
      validation: commonValidations.combine(
        commonValidations.required("Code"),
        commonValidations.pattern(
          "Code",
          /^([A-Z][a-z]+(?:-[A-Z][a-z]+)?)(\s[A-Z][a-z]+(?:-[A-Z][a-z]+)?)*$/,
          `Code invalide`
        )
      )
    }),
    generateField({
      type: TEXT,
      label: "CoefficientMT",
      value: row ? row.CoefficientMT : "",
      propsType: "number",
      propsLabel: "Coefficient",
      enablePlaceholder: true,
      validation: {
        validate: (value) =>
          value > 0 ? true : "Le coefficient doit être positif."
      }
    }),
    generateField({
      type: SELECT,
      label: "MatriculeNV",
      value: row ? row.MatriculeNV : "",
      propsLabel: "Niveau",
      options:
        MatiereFormData?.["niveaux"]?.map((nv) => ({
          value: nv.MatriculeNV,
          label:
            nv.NomNV
        })) || [],
      validation: commonValidations.required("Niveau")
    }),
    generateField({
      type: TEXTAREA,
      label: "DescriptionMT",
      value: row ? row.DescriptionMT : "",
      propsLabel: "Description",
      enablePlaceholder: true,
      validation: commonValidations.combine(
        commonValidations.maxLength("Description", 500)
      )
    }),
    generateField({
      type: MULTI_SELECT,
      label: "professeurs",
      propsLabel: "Professeurs",
      options: MatiereFormData?.professeurs?.professeurs?.map((p) => ({
        value: p.MatriculePR,
        label: p.FullNamePR
      })) || [],
      value: MatiereFormData?.professeurs?.selectedPR || [],
    }),
    generateField({
      type: TEXT,
      label: "max_sessions_per_week",
      value: row ? row.max_sessions_per_week : "",
      propsType: "number",
      propsLabel: "Max Sesions per Week",
      enablePlaceholder: true,
      validation: {
        validate: (value) =>
          value >= 0 && value <= Number(MatiereFormData?.max_sessions_per_week) ? true : "Le coefficient doit être positif and litter then ."+MatiereFormData?.max_of_max_sessions_per_week
      }
    }),
  ];
  //console.log("Data:", MatiereFormData, "Row:", row, "matiereDT:",matiereDT);
  // Étape 2 : Nombre total d'examens
  const step2Fields = [
    generateField({
      type: TEXT,
      label: "NbrEVMT",
      propsType: "number",
      value: (row ? row.total_evaluations : ""),
      propsLabel: "Nombre total d’examens",
      enablePlaceholder: true,
    })
  ];

  // Étape 3 : Détails des examens
  const step3Fields = [];

  if (NbrEVMT && !isNaN(NbrEVMT)) {
    const total = Number(NbrEVMT);
    const availableTypes = MatiereFormData?.["evaluation-types"] || [];
    const typeCount = Math.min(total, availableTypes.length);

    const autoDistrib = (index, total, parts) => {
      const base = Math.floor(total / parts);
      const rest = total % parts;
      return base + (index < rest ? 1 : 0);
    };

    for (let i = 0; i < typeCount; i++) {
      const type = availableTypes[i];
      const examCount = autoDistrib(i, total, typeCount);
      step3Fields.push(
        generateField({
          type: SELECT,
          value: row?.evaluations?.[i]?.MatriculeEP || "",
          label: `MatriculeEP_${i}`,
          propsLabel: `Type d’évaluation #${i + 1}`,
          options: availableTypes.map((type) => ({
            value: type.MatriculeEP,
            label: `${type.NameEP} (${type.PorsentageEP}%)`
          })),
        }),
        generateField({
          type: TEXT,
          label: `NbrEV_${i}`,
          propsLabel: `Nombre d’examens #${i + 1}`,
          propsType: "number",
          value: row?.evaluations?.[i]?.NbrEV || "",
          enablePlaceholder: true,
          validation: {
              validate: (value) => {
                const val = Number(NbrEVMT);
                const sum = NbrEVFields.reduce((a, b) => a + Number(b || 0), 0);
                if (NbrEVFields.filter((v) => v).length > 0 && sum !== val) {
                  return `La somme des examens (${sum}) doit être égale à ${val}`;
                }
                
                  if (
                  MatriculeEPFields.filter(Boolean).length > 0 &&
                  totalPourcentage !== 100
                ) {
                  return `La somme des pourcentages doit être égale à 100% (actuel: ${totalPourcentage}%)`;
                }
                
                  return true;
              }
          }
        }),
      );
    }
  }

  return [
    {
      title: "Informations sur la matière",
      Fields: step1Fields
    },
      ...(NbrEVMT && NbrEVMT>0 ? [
        {
          title: "Nombre total d’examens",
          Fields: step2Fields
        },
        {
          title: "Détails des examens",
          Fields: step3Fields
        }
      ] : [
        {
          title: "Nombre total d’examens",
          Fields: step2Fields
        },
      ]
    )
  ];
};
