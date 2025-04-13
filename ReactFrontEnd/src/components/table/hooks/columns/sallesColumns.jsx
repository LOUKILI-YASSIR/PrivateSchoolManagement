import React from "react";

export const sallesColumns = (Traduction, FilterModeOptions) => [
  {
    header: Traduction("Data.matricule"),
    accessorKey: "matriculeSl",
    filterFn: "equals",
    columnFilterModeOptions: [...FilterModeOptions["equality"]],
  },
  {
    header: Traduction("Data.name"),
    accessorKey: "NameSl",
    filterFn: "fuzzy",
    columnFilterModeOptions: [
      ...FilterModeOptions["text"],
      ...FilterModeOptions["equality"],
    ],
  },
  {
    header: Traduction("Data.capacity"),
    accessorKey: "CapacitySl",
    filterFn: "greaterThanOrEqualTo",
    columnFilterModeOptions: [
      ...FilterModeOptions["comparison"],
      ...FilterModeOptions["range"],
    ],
  },
  {
    header: Traduction("Data.location"),
    accessorKey: "LocationSl",
    filterFn: "fuzzy",
    columnFilterModeOptions: [
      ...FilterModeOptions["text"],
      ...FilterModeOptions["equality"],
    ],
  },
  {
    header: Traduction("Data.resources"),
    accessorKey: "ressourcesSl",
    filterFn: "fuzzy",
    columnFilterModeOptions: [
      ...FilterModeOptions["text"],
      ...FilterModeOptions["equality"],
    ],
  },
  {
    header: Traduction("Data.type"),
    accessorKey: "typeSl",
    filterFn: "equals",
    filterVariant: "select",
    filterSelectOptions: ["classroom", "lab", "auditorium", "other"],
    columnFilterModeOptions: [...FilterModeOptions["equality"]],
  },
  {
    header: Traduction("Data.status"),
    accessorKey: "statusSl",
    filterFn: "equals",
    filterVariant: "select",
    filterSelectOptions: ["available", "occupied", "maintenance", "inactive"],
    columnFilterModeOptions: [...FilterModeOptions["equality"]],
  },
  {
    header: Traduction("Data.floor"),
    accessorKey: "floorSl",
    filterFn: "equals",
    columnFilterModeOptions: [...FilterModeOptions["equality"]],
  },
  {
    header: Traduction("Data.observation"),
    accessorKey: "observationSl",
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