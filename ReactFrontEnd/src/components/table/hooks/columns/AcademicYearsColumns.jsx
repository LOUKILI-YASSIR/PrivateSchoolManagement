import React, { useMemo } from "react";

export const AcademicYearsColumns = (Traduction, FilterModeOptions) => [
  {
    header: Traduction("Data.matricule"),
    accessorKey: "MatriculeYR",
    filterFn: "equals",
    columnFilterModeOptions: [...FilterModeOptions["equality"]],
  },
  {
    header: Traduction("Data.name"),
    accessorKey: "NameYR",
    filterFn: "fuzzy",
    columnFilterModeOptions: [
      ...FilterModeOptions["text"],
      ...FilterModeOptions["equality"],
    ],
  },
  {
    header: Traduction("Data.description"),
    accessorKey: "DescriptionYR",
    filterFn: "fuzzy",
    columnFilterModeOptions: [
      ...FilterModeOptions["text"],
      ...FilterModeOptions["equality"],
    ],
  },
  {
    header: Traduction("Data.startDate"),
    accessorKey: "StartDateYR",
    filterFn: "greaterThanOrEqualTo",
    filterVariant: "date",
    columnFilterModeOptions: [
      ...FilterModeOptions["comparison"],
      ...FilterModeOptions["range"],
    ],
    Cell: ({ renderedCellValue }) => {
      if (!renderedCellValue) return null;
      return new Date(renderedCellValue).toLocaleDateString();
    },
  },
  {
    header: Traduction("Data.endDate"),
    accessorKey: "EndDateYR",
    filterFn: "greaterThanOrEqualTo",
    filterVariant: "date",
    columnFilterModeOptions: [
      ...FilterModeOptions["comparison"],
      ...FilterModeOptions["range"],
    ],
    Cell: ({ renderedCellValue }) => {
      if (!renderedCellValue) return null;
      return new Date(renderedCellValue).toLocaleDateString();
    },
  },
  {
    header: Traduction("Data.archivedDate"),
    accessorKey: "ArchivedDateYR",
    filterFn: "greaterThanOrEqualTo",
    filterVariant: "date",
    columnFilterModeOptions: [
      ...FilterModeOptions["comparison"],
      ...FilterModeOptions["range"],
    ],
    Cell: ({ renderedCellValue }) => {
      if (!renderedCellValue) return null;
      return new Date(renderedCellValue).toLocaleDateString();
    },
  },
  {
    header: Traduction("Data.status"),
    accessorKey: "StatusYR",
    filterFn: "equals",
    filterVariant: "select",
    filterSelectOptions: ["active", "inactive", "archived"],
    columnFilterModeOptions: [...FilterModeOptions["equality"]],
  },
  {
    header: Traduction("Data.isCurrent"),
    accessorKey: "IsCurrentYR",
    filterFn: "equals",
    filterVariant: "select",
    filterSelectOptions: [true, false],
    columnFilterModeOptions: [...FilterModeOptions["equality"]],
    Cell: ({ renderedCellValue }) => {
      return renderedCellValue ? "✅" : "❌";
    },
  },
  {
    header: Traduction("Data.createdBy"),
    accessorKey: "user.UserNameUT",
    filterFn: "fuzzy",
    columnFilterModeOptions: [
      ...FilterModeOptions["text"],
      ...FilterModeOptions["equality"],
    ],
  },
];
