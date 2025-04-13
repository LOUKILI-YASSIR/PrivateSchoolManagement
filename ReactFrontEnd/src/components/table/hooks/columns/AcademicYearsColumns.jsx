import React, { useMemo } from "react";

export const AcademicYearsColumns = (Traduction, FilterModeOptions) => [
  {
    header: Traduction("Data.matricule"),
    accessorKey: "matriculeYR",
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
    accessorKey: "descriptionYR",
    filterFn: "fuzzy",
    columnFilterModeOptions: [
      ...FilterModeOptions["text"],
      ...FilterModeOptions["equality"],
    ],
  },
  {
    header: Traduction("Data.startDate"),
    accessorKey: "startDateYR",
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
    accessorKey: "endDateYR",
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
    accessorKey: "statusYR",
    filterFn: "equals",
    filterVariant: "select",
    filterSelectOptions: ["active", "inactive", "archived"],
    columnFilterModeOptions: [...FilterModeOptions["equality"]],
  },
  {
    header: Traduction("Data.isCurrent"),
    accessorKey: "isCurrentYR",
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
    accessorKey: "user.usernameUt",
    filterFn: "fuzzy",
    columnFilterModeOptions: [
      ...FilterModeOptions["text"],
      ...FilterModeOptions["equality"],
    ],
  },
];
