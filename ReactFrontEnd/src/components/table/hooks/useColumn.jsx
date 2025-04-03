import { useEffect, useMemo, useState } from "react";
import { Image } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { generateCityOptions, generateCountryOptions } from "../../form/utils/countryUtils";

/**
 * This function defines and returns the column structure for tables,
 * with advanced filtering and configuration options.
 *
 * @param {Array} data - The table data to be displayed.
 * @param {string} TableName - The name of the table to fetch columns for.
 * @returns {Array} - Array of column definitions.
 */
export const useColumns = (data, TableName) => {
  const { t: Traduction } = useTranslation();
  const columns = useMemo(() => {
    if (!data || data.length === 0) return [];

    const FilterModeOptions = {
      comparison: [
        "greaterThan",
        "greaterThanOrEqualTo",
        "lessThan",
        "lessThanOrEqualTo",
      ],
      range: [
        "between", 
        "betweenInclusive"
      ],
      text: [
        "contains",
        "endsWith", 
        "equals", 
        "fuzzy", 
        "startsWith"
      ],
      emptyState: [
        "empty", 
        "notEmpty"
      ],
      equality: [
        "equals", 
        "notEquals"
      ],
    };

    /*
      filterFn (default filter Option from FilterModeOptions)

      filterVarient (one of this list [
      'text' | 'select' | 'multi-select' | 'range' | 'range-slider' | 'checkbox' |
      'autocomplete' | 'date' | 'date-range' | 'datetime' | 'datetime-range' | 'time' | 'time-range'])
    */

    const tables = {
      etudiants: [
        {
          header: Traduction("Data.image"),
          accessorKey: "PROFILE_PICTUREEt",
          enableColumnFilter: false,
          enableColumnFilterModes: false,
          enableFilterMatchHighlighting: false,
          Cell: ({ renderedCellValue }) => {
            // Utilisez useMemo pour éviter de recalculer imageUrl à chaque render
            const imageUrl = useMemo(() => {
              if (renderedCellValue) {
                // Supprimez "/uploads/" si nécessaire et ajoutez un timestamp pour éviter le cache
                return `/uploads/etudiants/${renderedCellValue.replace("/uploads/", "")}?v=${Date.now()}`;
              }
              return "/uploads/default.jpg";
            }, [renderedCellValue]);
        
            // État pour suivre si l'image a déjà échoué
            const [hasFailed, setHasFailed] = useState(false);
        
            return (
              <img
                src={hasFailed ? "/uploads/default.jpg" : imageUrl}
                alt="etudiant"
                width="45px"
                height="45px"
                style={{ borderRadius: "50%" }}
                onError={(e) => {
                  e.target.onerror = null; // Empêche les boucles infinies
                  setHasFailed(true); // Marque l'image comme échouée
                }}
                // Supprime onLoad pour éviter de réinitialiser hasFailed
              />
            );
          },
        },
        {
          header: Traduction("Data.genre"),
          accessorKey: "GENREEt",
          filterVariant: "select",
          filterSelectOptions: ["Homme", "Femelle"],
          columnFilterModeOptions: [...FilterModeOptions["equality"]],
          filterFn: "equals",  
        },
        {
          header: Traduction("Data.nom"),
          accessorKey: "NOMEt",
          filterFn: "fuzzy",
          columnFilterModeOptions: [
            ...FilterModeOptions["text"],
            ...FilterModeOptions["equality"],
          ],
        },
        {
          header: Traduction("Data.prenom"),
          accessorKey: "PRENOMEt",
          filterFn: "fuzzy",
          columnFilterModeOptions: [
            ...FilterModeOptions["text"],
            ...FilterModeOptions["equality"],
          ],
        },
        {
          header: Traduction("Data.lieunaissance"),
          accessorKey: "LIEU_NAISSANCEEt",
          filterFn: "fuzzy",
          columnFilterModeOptions: [
            ...FilterModeOptions["text"],
            ...FilterModeOptions["equality"],
          ],
        },
        {
          header: Traduction("Data.datenaissance"),
          accessorKey: "DATE_NAISSANCEEt",
          filterFn: "greaterThanOrEqualTo",
          filterVariant: "date",
          columnFilterModeOptions: [
            ...FilterModeOptions["text"],
            ...FilterModeOptions["equality"],
            ...FilterModeOptions["comparison"],
          ],
        },
        {
          header: Traduction("Data.nationalite"),
          accessorKey: "NATIONALITEEt",
          filterFn: "equals",
          filterSelectOptions: generateCountryOptions(),
          filterVariant: "select",
          columnFilterModeOptions: [...FilterModeOptions["equality"]],
          Cell: ({ renderedCellValue }) => {
            const flagSrc = useMemo(() => {
              if (!renderedCellValue) return null;
        
              const countryCode = renderedCellValue;
        
              return `/country-flag-icons-3x2/${countryCode}.svg`;
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
          header: Traduction("Data.adresse"),
          accessorKey: "ADRESSEEt",
          filterFn: "contains",
          columnFilterModeOptions: [
            ...FilterModeOptions["text"],
            ...FilterModeOptions["equality"],
          ],        
        },
        {
          header: Traduction("Data.ville"),
          accessorKey: "VILLEEt",

          filterVariant: "text",
          columnFilterModeOptions: [...FilterModeOptions.text, ...FilterModeOptions.equality]
        },
        {
          header: Traduction("Data.pays"),
          accessorKey: "PAYSEt",
          filterSelectOptions: generateCountryOptions(),
          filterFn: "equals",
          filterVariant: "select",
          columnFilterModeOptions: [...FilterModeOptions["equality"]],
          Cell: ({ renderedCellValue }) => {
            const flagSrc = useMemo(() => {
              if (!renderedCellValue) return null;
        
              const countryCode = renderedCellValue;
        
              return `/country-flag-icons-3x2/${countryCode}.svg`;
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
      ],

      professeurs: [
        {
          header: Traduction("Data.image"),
          accessorKey: "PROFILE_PICTUREPr",
          Cell: ({ renderedCellValue, row }) => (
            <Image
              className="rounded-circle"
              src={row.originale["PROFILE_PICTUREPr"] || "/images/default.jpg"}
              alt="professeur"
              width={ "45px"}
              height={"45px"}
            />
          ),
        },
        {
          header: Traduction("Data.nom"),
          accessorKey: "NOMPr",
          filterFn: "fuzzy",
          columnFilterModeOptions: [
            ...FilterModeOptions["text"],
            ...FilterModeOptions["equality"],
          ],           
        },
        {
          header: Traduction("Data.prenom"),
          accessorKey: "PRENOMPr",
          filterFn: "fuzzy",
          columnFilterModeOptions: [
            ...FilterModeOptions["text"],
            ...FilterModeOptions["equality"],
          ],   
        },
        {
          header: Traduction("Data.nationalite"),
          accessorKey: "NATIONALITEPr",
          filterFn: "equals",
          filterVariant: "select",
          columnFilterModeOptions: [...FilterModeOptions["equality"]],
        },
        {
          header: Traduction("Data.datenaissance"),
          accessorKey: "DATE_NAISSANCEPr",
          filterFn: "greaterThanOrEqualTo",
          filterVariant: "date",
          columnFilterModeOptions: [
            ...FilterModeOptions["text"],
            ...FilterModeOptions["equality"],
            ...FilterModeOptions["comparison"],
          ],
        },
        {
          header: Traduction("Data.salaire"),
          accessorKey: "SALAIREPr",
          filterFn: "range",
          filterVariant: "range-slider",
          columnFilterModeOptions: [...FilterModeOptions["range"]],
        },
      ],
    };

    return tables[TableName] || [];
  }, [data, Traduction, TableName]);

  return columns;
};
