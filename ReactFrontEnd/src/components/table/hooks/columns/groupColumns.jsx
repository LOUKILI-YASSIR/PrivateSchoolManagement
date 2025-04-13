
export const groupColumns = (Traduction, FilterModeOptions) => [
  {
    header: Traduction("Data.matricule"),
    accessorKey: "matriculeGp",
    filterFn: "equals",
    columnFilterModeOptions: [...FilterModeOptions["equality"]],
  },
  {
    header: Traduction("Data.name"),
    accessorKey: "NameGp",
    filterFn: "fuzzy",
    columnFilterModeOptions: [
      ...FilterModeOptions["text"],
      ...FilterModeOptions["equality"],
    ],
  },
  {
    header: Traduction("Data.description"),
    accessorKey: "descriptionGp",
    filterFn: "fuzzy",
    columnFilterModeOptions: [
      ...FilterModeOptions["text"],
      ...FilterModeOptions["equality"],
    ],
  },
  {
    header: Traduction("Data.status"),
    accessorKey: "statusGp",
    filterFn: "equals",
    filterVariant: "select",
    filterSelectOptions: ["active", "inactive"],
    columnFilterModeOptions: [...FilterModeOptions["equality"]],
  },
  {
    header: Traduction("Data.niveau"),
    accessorKey: "niveau.NomNv",
    filterFn: "fuzzy",
    columnFilterModeOptions: [
      ...FilterModeOptions["text"],
      ...FilterModeOptions["equality"],
    ],
  },
  {
    header: Traduction("Data.studentsCount"),
    accessorKey: "etudiants_count",
    filterFn: "greaterThanOrEqualTo",
    columnFilterModeOptions: [
      ...FilterModeOptions["comparison"],
      ...FilterModeOptions["range"],
    ],
  },
];