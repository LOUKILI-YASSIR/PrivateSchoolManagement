// hooks/useColumns.js
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { etudiantsColumns } from "./columns/etudiantsColumns.jsx";
import { professeursColumns } from "./columns/professeursColumns.jsx";
import { groupColumns } from "./columns/groupColumns.jsx";
import { AcademicYearsColumns } from "./columns/AcademicYearsColumns.jsx";
import { sallesColumns } from "./columns/sallesColumns.jsx";
import { matiereColumns } from "./columns/matiereColumns.jsx";
import { evaluationsColumns } from "./columns/evaluationsColumns.jsx";
import { niveauxColumns } from "./columns/niveauxColumns.jsx";

/**
 * Returns an array of column definitions for tables with advanced filtering.
 *
 * @param {Array} data - The table data to be displayed.
 * @param {string} TableName - The key for the table type.
 * @returns {Array} Columns for the table.
 */
export const useColumns = (data, TableName) => {
  const { t: Traduction } = useTranslation();
  console.log(data)
  const columns = useMemo(() => {
    if (!data || data.length === 0) return [];

    // Define filter mode options.
    const FilterModeOptions = {
      comparison: ["greaterThan", "greaterThanOrEqualTo", "lessThan", "lessThanOrEqualTo"],
      range: ["between", "betweenInclusive"],
      text: ["contains", "endsWith", "equals", "fuzzy", "startsWith"],
      emptyState: ["empty", "notEmpty"],
      equality: ["equals", "notEquals"],
    };

    const tables = {
      etudiants: etudiantsColumns(Traduction, FilterModeOptions),
      professeurs: professeursColumns(Traduction, FilterModeOptions),
      groups: groupColumns(Traduction, FilterModeOptions),
      academicYears: AcademicYearsColumns(Traduction, FilterModeOptions),
      salles: sallesColumns(Traduction, FilterModeOptions),
      matieres: matiereColumns(Traduction, FilterModeOptions),
      evaluations: evaluationsColumns(Traduction, FilterModeOptions),
      niveaux: niveauxColumns(Traduction, FilterModeOptions),
    };

    return tables[TableName] || [];
  }, [data, TableName, Traduction]);

  return columns;
};
