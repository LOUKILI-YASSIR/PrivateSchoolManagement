import React from "react";

export const niveauxColumns = (Traduction, FilterModeOptions) => [
  {
    header: Traduction("Data.matricule"),
    accessorKey: "matriculeNv",
    filterFn: "equals",
    columnFilterModeOptions: [...FilterModeOptions["equality"]],
  },
  {
    header: Traduction("Data.code"),
    accessorKey: "codeNv",
    filterFn: "fuzzy",
    columnFilterModeOptions: [
      ...FilterModeOptions["text"],
      ...FilterModeOptions["equality"],
    ],
  },
  {
    header: Traduction("Data.name"),
    accessorKey: "NomNv",
    filterFn: "fuzzy",
    columnFilterModeOptions: [
      ...FilterModeOptions["text"],
      ...FilterModeOptions["equality"],
    ],
  },
  {
    header: Traduction("Data.type"),
    accessorKey: "typeNv",
    filterFn: "equals",
    filterVariant: "select",
    filterSelectOptions: ["primary", "secondary", "college", "other"],
    columnFilterModeOptions: [...FilterModeOptions["equality"]],
  },
  {
    header: Traduction("Data.description"),
    accessorKey: "descriptionNv",
    filterFn: "fuzzy",
    columnFilterModeOptions: [
      ...FilterModeOptions["text"],
      ...FilterModeOptions["equality"],
    ],
  },
  {
    header: Traduction("Data.status"),
    accessorKey: "statusNv",
    filterFn: "equals",
    filterVariant: "select",
    filterSelectOptions: ["active", "inactive"],
    columnFilterModeOptions: [...FilterModeOptions["equality"]],
  },
  {
    header: Traduction("Data.parent"),
    accessorFn: (row) => row.parent?.NomNv || '-',
    id: 'parentNomNv',
    filterFn: "fuzzy",
    columnFilterModeOptions: [
      ...FilterModeOptions["text"],
      ...FilterModeOptions["equality"],
    ],
    Cell: ({ row }) => {
      const parent = row.original.parent;
      return parent ? parent.NomNv : "-";
    },
  },
  {
    header: Traduction("Data.groupsCount"),
    accessorKey: "groups_count",
    filterFn: "greaterThanOrEqualTo",
    columnFilterModeOptions: [
      ...FilterModeOptions["comparison"],
      ...FilterModeOptions["range"],
    ],
  },
  {
    header: Traduction("Data.matieresCount"),
    accessorKey: "matieres_count",
    filterFn: "greaterThanOrEqualTo",
    columnFilterModeOptions: [
      ...FilterModeOptions["comparison"],
      ...FilterModeOptions["range"],
    ],
  },
];