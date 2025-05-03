import React from "react";

export const niveauxColumns = (Traduction, FilterModeOptions) => [
  {
    header: Traduction("Data.matricule"),
    accessorKey: "MatriculeNV",
    filterFn: "equals",
    columnFilterModeOptions: [...FilterModeOptions["equality"]],
  },
  {
    header: Traduction("Data.code"),
    accessorKey: "CodeNV",
    filterFn: "fuzzy",
    columnFilterModeOptions: [
      ...FilterModeOptions["text"],
      ...FilterModeOptions["equality"],
    ],
  },
  {
    header: Traduction("Data.name"),
    accessorKey: "NomNV",
    filterFn: "fuzzy",
    columnFilterModeOptions: [
      ...FilterModeOptions["text"],
      ...FilterModeOptions["equality"],
    ],
  },
  {
    header: Traduction("Data.type"),
    accessorKey: "TypeNV",
    filterFn: "equals",
    filterVariant: "select",
    filterSelectOptions: ["primary", "secondary", "college", "other"],
    columnFilterModeOptions: [...FilterModeOptions["equality"]],
  },
  {
    header: Traduction("Data.description"),
    accessorKey: "DescriptionNV",
    filterFn: "fuzzy",
    columnFilterModeOptions: [
      ...FilterModeOptions["text"],
      ...FilterModeOptions["equality"],
    ],
  },
  {
    header: Traduction("Data.status"),
    accessorKey: "StatusNV",
    filterFn: "equals",
    filterVariant: "select",
    filterSelectOptions: ["active", "inactive"],
    columnFilterModeOptions: [...FilterModeOptions["equality"]],
  },
  {
    header: Traduction("Data.parent"),
    accessorFn: (row) => row.parent?.NomNV || '-',
    id: 'parentNomNv',
    filterFn: "fuzzy",
    columnFilterModeOptions: [
      ...FilterModeOptions["text"],
      ...FilterModeOptions["equality"],
    ],
    Cell: ({ row }) => {
      const parent = row.original.parent;
      return parent ? parent.NomNV : "-";
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