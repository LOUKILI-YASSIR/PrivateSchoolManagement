import React, { useMemo, useState } from "react";
import { generateCountryOptions, generateCityOptions } from "../../../form/utils/countryUtils";

export const professeursColumns = (Traduction, FilterModeOptions) => [
  {
    header: Traduction("Data.image"),
    accessorKey: "user.ProfileFileNamePl",
    enableColumnFilter: false,
    enableColumnFilterModes: false,
    enableFilterMatchHighlighting: false,
    Cell: ({ renderedCellValue }) => {
      const imageUrl = useMemo(() => {
        if (renderedCellValue) {
          return `/uploads/professeurs/${renderedCellValue.replace("/uploads/", "")}?v=${Date.now()}`;
        }
        return "/uploads/default.jpg";
      }, [renderedCellValue]);

      const [hasFailed, setHasFailed] = useState(false);

      return (
        <img
          src={hasFailed ? "/uploads/default.jpg" : imageUrl}
          alt="professeur"
          width="45px"
          height="45px"
          style={{ borderRadius: "50%" }}
          onError={(e) => {
            e.target.onerror = null;
            setHasFailed(true);
          }}
        />
      );
    },
  },
  {
    header: Traduction("Data.matricule"),
    accessorKey: "matriculePr",
    filterFn: "equals",
    columnFilterModeOptions: [...FilterModeOptions["equality"]],
  },
  {
    header: Traduction("Data.genre"),
    accessorKey: "user.GenrePl",
    columnFilterModeOptions: [...FilterModeOptions["equality"]],
    filterFn: "equals",
  },
  {
    header: Traduction("Data.nom"),
    accessorKey: "user.NomPl",
    filterFn: "fuzzy",
    columnFilterModeOptions: [
      ...FilterModeOptions["text"],
      ...FilterModeOptions["equality"],
    ],
  },
  {
    header: Traduction("Data.prenom"),
    accessorKey: "user.prenomPl",
    filterFn: "fuzzy",
    columnFilterModeOptions: [
      ...FilterModeOptions["text"],
      ...FilterModeOptions["equality"],
    ],
  },
  {
    header: Traduction("Data.lieunaissance"),
    accessorKey: "user.LieuNaissancePl",
    filterFn: "fuzzy",
    columnFilterModeOptions: [
      ...FilterModeOptions["text"],
      ...FilterModeOptions["equality"],
    ],
  },
  {
    header: Traduction("Data.datenaissance"),
    accessorKey: "user.DateNaissancePl",
    filterFn: "greaterThanOrEqualTo",
    filterVariant: "date",
    columnFilterModeOptions: [
      ...FilterModeOptions["comparison"],
      ...FilterModeOptions["range"],
    ],
  },
  {
    header: Traduction("Data.nationalite"),
    accessorKey: "user.NationalitePl",
    filterFn: "equals",
    filterVariant: "select",
    filterSelectOptions: generateCountryOptions(),
    columnFilterModeOptions: [...FilterModeOptions["equality"]],
    Cell: ({ renderedCellValue }) => {
      const flagSrc = useMemo(() => {
        if (!renderedCellValue) return null;
        return `/country-flag-icons-3x2/${renderedCellValue}.svg`;
      }, [renderedCellValue]);

      if (!flagSrc) {
        return <span className="placeholder">-</span>;
      }

      return (
        <img
          src={flagSrc}
          alt={`${renderedCellValue} flag`}
          width="32"
          height="21"
          onError={(e) => {
            e.target.src = "/country-flag-icons-3x2/MA.svg";
            e.target.alt = "Default flag";
          }}
          style={{ verticalAlign: "middle" }}
        />
      );
    },
  },
  {
    header: Traduction("Data.email"),
    accessorKey: "user.emailUt",
    filterFn: "contains",
    columnFilterModeOptions: [
      ...FilterModeOptions["text"],
      ...FilterModeOptions["equality"],
    ],
  },
  {
    id: "phone1",
    header: Traduction("Data.telephone") + " 1",
    accessorKey: "Phone1Pr",
    filterFn: "contains",
    columnFilterModeOptions: [
      ...FilterModeOptions["text"],
      ...FilterModeOptions["equality"],
    ],
  },
  {
    id: "phone2",
    header: Traduction("Data.telephone") + " 2",
    accessorKey: "Phone2Pr",
    filterFn: "contains",
    columnFilterModeOptions: [
      ...FilterModeOptions["text"],
      ...FilterModeOptions["equality"],
    ],
  },
  {
    header: Traduction("Data.adresse"),
    accessorKey: "user.AdressPl",
    filterFn: "contains",
    columnFilterModeOptions: [
      ...FilterModeOptions["text"],
      ...FilterModeOptions["equality"],
    ],
  },
  {
    header: Traduction("Data.pays"),
    accessorKey: "user.PaysPl",
    filterFn: "equals",
    filterVariant: "select",
    filterSelectOptions: generateCountryOptions(),
    columnFilterModeOptions: [...FilterModeOptions["equality"]],
    Cell: ({ renderedCellValue }) => {
      const flagSrc = useMemo(() => {
        if (!renderedCellValue) return null;
        return `/country-flag-icons-3x2/${renderedCellValue}.svg`;
      }, [renderedCellValue]);

      if (!flagSrc) {
        return <span className="placeholder">-</span>;
      }

      return (
        <img
          src={flagSrc}
          alt={`${renderedCellValue} flag`}
          width="32"
          height="21"
          onError={(e) => {
            e.target.src = "/country-flag-icons-3x2/MA.svg";
            e.target.alt = "Default flag";
          }}
          style={{ verticalAlign: "middle" }}
        />
      );
    },
  },
  {
    header: Traduction("Data.ville"),
    accessorKey: "user.VillePl",
    filterFn: "equals",
    filterVariant: "select",
    filterSelectOptions: generateCityOptions(),
    columnFilterModeOptions: [...FilterModeOptions["equality"]],
  },
  {
    header: Traduction("Data.salaire"),
    accessorKey: "SalairePr",
    filterFn: "contains",
    columnFilterModeOptions: [
      ...FilterModeOptions["comparison"],
      ...FilterModeOptions["equality"],
      ...FilterModeOptions["range"],
    ],
  },
  {
    header: Traduction("Data.cin"),
    accessorKey: "CINPr",
    filterFn: "contains",
    columnFilterModeOptions: [
      ...FilterModeOptions["text"],
      ...FilterModeOptions["equality"],
      ...FilterModeOptions["emptyState"],
    ],
  },
  {
    header: Traduction("Data.dateEmbauche"),
    accessorKey: "DateEmbauchePr",
    filterFn: "greaterThanOrEqualTo",
    filterVariant: "date",
    columnFilterModeOptions: [
      ...FilterModeOptions["comparison"],
      ...FilterModeOptions["range"],
    ],
  },
  {
    header: Traduction("Data.ProfPhone1"),
    accessorKey: "Phone1Pr",
    filterFn: "contains",
    columnFilterModeOptions: [
      ...FilterModeOptions["text"],
      ...FilterModeOptions["equality"],
    ],
  },
  {
    header: Traduction("Data.ProfPhone2"),
    accessorKey: "Phone2Pr",
    filterFn: "contains",
    columnFilterModeOptions: [
      ...FilterModeOptions["text"],
      ...FilterModeOptions["equality"],
    ],
  },
  {
    header: Traduction("Data.status"),
    accessorKey: "user.statutUt",
    filterFn: "equals",
    filterVariant: "select",
    filterSelectOptions: ["active", "inactive"],
    columnFilterModeOptions: [...FilterModeOptions["equality"]],
  },
];
