import React from "react";

export const evaluationsColumns = (Traduction, FilterModeOptions) => [
  {
    header: Traduction("Data.matricule"),
    accessorKey: "matriculeEv",
    filterFn: "equals",
    columnFilterModeOptions: [...FilterModeOptions["equality"]],
  },
  {
    header: Traduction("Data.subject"),
    accessorKey: "matiere.nameMt",
    filterFn: "fuzzy",
    columnFilterModeOptions: [
      ...FilterModeOptions["text"],
      ...FilterModeOptions["equality"],
    ],
  },
  {
    header: Traduction("Data.evaluationType"),
    accessorKey: "evaluation_type.nameEp",
    filterFn: "fuzzy",
    columnFilterModeOptions: [
      ...FilterModeOptions["text"],
      ...FilterModeOptions["equality"],
    ],
  },
  {
    header: Traduction("Data.evaluationNumber"),
    accessorKey: "nbrEv",
    filterFn: "greaterThanOrEqualTo",
    columnFilterModeOptions: [
      ...FilterModeOptions["comparison"],
      ...FilterModeOptions["range"],
    ],
  },
  {
    header: Traduction("Data.resultsCount"),
    accessorKey: "evaluation_results_count",
    filterFn: "greaterThanOrEqualTo",
    columnFilterModeOptions: [
      ...FilterModeOptions["comparison"],
      ...FilterModeOptions["range"],
    ],
  },
];
