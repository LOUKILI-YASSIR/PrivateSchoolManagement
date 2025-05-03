import React from "react";

export const matiereColumns = (Traduction, FilterModeOptions) => [
  {
    header: Traduction("Data.matricule"),
    accessorKey: "MatriculeMT",
    filterFn: "equals",
    columnFilterModeOptions: [...FilterModeOptions["equality"]],
  },
  {
    header: Traduction("Data.name"),
    accessorKey: "NameMT",
    filterFn: "fuzzy",
    columnFilterModeOptions: [
      ...FilterModeOptions["text"],
      ...FilterModeOptions["equality"],
    ],
  },
  {
    header: Traduction("Data.code"),
    accessorKey: "CodeMT",
    filterFn: "fuzzy",
    columnFilterModeOptions: [
      ...FilterModeOptions["text"],
      ...FilterModeOptions["equality"],
    ],
  },
  {
    header: Traduction("Data.description"),
    accessorKey: "DescriptionMT",
    filterFn: "fuzzy",
    columnFilterModeOptions: [
      ...FilterModeOptions["text"],
      ...FilterModeOptions["equality"],
    ],
  },
  {
    header: Traduction("Data.coefficient"),
    accessorKey: "CoefficientMT",
    filterFn: "greaterThanOrEqualTo",
    columnFilterModeOptions: [
      ...FilterModeOptions["comparison"],
      ...FilterModeOptions["range"],
    ],
  },
  {
    header: Traduction("Data.niveau"),
    accessorFn: (row) => row.niveau?.NomNV || '-',
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
      return `${prof.user.NomPL} ${prof.user.PrenomPL}`;
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