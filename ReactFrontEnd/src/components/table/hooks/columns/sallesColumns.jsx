import React from "react";

export const sallesColumns = (Traduction, FilterModeOptions) => [
  {
    header: Traduction("Data.matricule"),
    accessorKey: "MatriculeSL",
    filterFn: "equals",
    columnFilterModeOptions: [...FilterModeOptions["equality"]],
  },
  {
    header: Traduction("Data.name"),
    accessorKey: "NameSL",
    filterFn: "fuzzy",
    columnFilterModeOptions: [
      ...FilterModeOptions["text"],
      ...FilterModeOptions["equality"],
    ],
  },
  {
    header: Traduction("Data.capacity"),
    accessorKey: "CapacitySL",
    filterFn: "greaterThanOrEqualTo",
    columnFilterModeOptions: [
      ...FilterModeOptions["comparison"],
      ...FilterModeOptions["range"],
    ],
  },
  {
    header: Traduction("Data.location"),
    accessorKey: "LocationSL",
    filterFn: "fuzzy",
    columnFilterModeOptions: [
      ...FilterModeOptions["text"],
      ...FilterModeOptions["equality"],
    ],
  },
  {
    header: Traduction("Data.resources"),
    accessorKey: "RessourcesSL",
    filterFn: "fuzzy",
    columnFilterModeOptions: [
      ...FilterModeOptions["text"],
      ...FilterModeOptions["equality"],
    ],
  },
  {
    header: Traduction("Data.type"),
    accessorKey: "TypeSL",
    filterFn: "equals",
    filterVariant: "select",
    filterSelectOptions: ["classroom", "lab", "auditorium", "other"],
    columnFilterModeOptions: [...FilterModeOptions["equality"]],
  },
  {
    header: Traduction("Data.status"),
    accessorKey: "StatusSL",
    filterFn: "equals",
    filterVariant: "select",
    filterSelectOptions: ["available", "occupied", "maintenance", "inactive"],
    columnFilterModeOptions: [...FilterModeOptions["equality"]],
  },
  {
    header: Traduction("Data.floor"),
    accessorKey: "FloorSL",
    filterFn: "equals",
    columnFilterModeOptions: [...FilterModeOptions["equality"]],
  },
  {
    header: Traduction("Data.observation"),
    accessorKey: "ObservationSL",
    filterFn: "fuzzy",
    columnFilterModeOptions: [
      ...FilterModeOptions["text"],
      ...FilterModeOptions["equality"],
    ],
  },
  {
    header: Traduction("Data.scheduledClasses"),
    accessorKey: "regularTimeTables",
    Cell: ({ row }) => {
      const timeTables = row.getValue("regularTimeTables");
      return timeTables ? timeTables.length : 0;
    },
    enableColumnFilter: false,
  },
];