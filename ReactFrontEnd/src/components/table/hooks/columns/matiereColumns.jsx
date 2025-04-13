import React from "react";

export const matiereColumns = (Traduction, FilterModeOptions) => [
  {
    header: Traduction("Data.matricule"),
    accessorKey: "matriculeMt",
    filterFn: "equals",
    columnFilterModeOptions: [...FilterModeOptions["equality"]],
  },
  {
    header: Traduction("Data.name"),
    accessorKey: "nameMt",
    filterFn: "fuzzy",
    columnFilterModeOptions: [
      ...FilterModeOptions["text"],
      ...FilterModeOptions["equality"],
    ],
  },
  {
    header: Traduction("Data.code"),
    accessorKey: "codeMt",
    filterFn: "fuzzy",
    columnFilterModeOptions: [
      ...FilterModeOptions["text"],
      ...FilterModeOptions["equality"],
    ],
  },
  {
    header: Traduction("Data.description"),
    accessorKey: "descriptionMt",
    filterFn: "fuzzy",
    columnFilterModeOptions: [
      ...FilterModeOptions["text"],
      ...FilterModeOptions["equality"],
    ],
  },
  {
    header: Traduction("Data.coefficient"),
    accessorKey: "coefficientMt",
    filterFn: "greaterThanOrEqualTo",
    columnFilterModeOptions: [
      ...FilterModeOptions["comparison"],
      ...FilterModeOptions["range"],
    ],
  },
  {
    header: Traduction("Data.niveau"),
    accessorFn: (row) => row.niveau?.NomNv || '-',
    id: 'niveauNom',
    filterFn: "fuzzy",
    columnFilterModeOptions: [
      ...FilterModeOptions["text"],
      ...FilterModeOptions["equality"],
    ],
  },
  {
    header: Traduction("Data.professor"),
    accessorFn: (row) => {
      const prof = row.professeur;
      if (!prof?.user) return '-';
      return `${prof.user.NomPl} ${prof.user.PrenomPl}`;
    },
    id: 'professeurNom',
    filterFn: "fuzzy",
    columnFilterModeOptions: [
      ...FilterModeOptions["text"],
      ...FilterModeOptions["equality"],
    ],
  },
  {
    header: Traduction("Data.evaluationsCount"),
    accessorFn: (row) => row.evaluations?.length || 0,
    id: 'evaluationsCount',
    enableColumnFilter: false,
  },
];