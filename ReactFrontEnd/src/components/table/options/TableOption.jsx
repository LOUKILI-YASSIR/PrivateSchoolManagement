import { Edit, RemoveRedEye } from "@mui/icons-material";
import { MRT_ActionMenuItem } from "material-react-table";
import { MRT_Localization_FR } from 'material-react-table/locales/fr';
import { MRT_Localization_EN } from 'material-react-table/locales/en';
import { MRT_Localization_DE } from 'material-react-table/locales/de';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import { useContext } from "react";
import { MainContext } from "../../../utils/contexts/MainContext";
import FormWrapper from "../../form/FormWrapper"; // Adjust import path as needed
import { useTranslation } from "react-i18next";
import ActionMenu from "../../Menu/ActionMenu";

export const GetInfoTable = () => {
  const { t: Traduction, i18n } = useTranslation();
  const Language = i18n.language;
  const ValueMainContext = useContext(MainContext);
  if (!ValueMainContext) return {}; // Handle undefined context gracefully
  const { TableName } = ValueMainContext;

  const PageTranslate = {
    etudiants: Traduction("TableDBName.student"),
    prefesseurs: Traduction("TableDBName.prof"), // Note: typo "prefesseurs" should be "professeurs"
  };

  return {
    LanguageOption: {
      fr: MRT_Localization_FR,
      en: MRT_Localization_EN,
      de: MRT_Localization_DE,
      es: MRT_Localization_ES,
    }[Language],
    ActionOption: (table, row, Handels, closeMenu, BoxOptionDeleteBy1, options = { consult: true, edit: true, remove: true }) => {
      const { consult, edit, remove } = options;
      const { handleDelete } = Handels;
      const itemId = row[{
        etudiants: "matriculeEt",
        professeurs: "matriculePr",
      }[TableName]];
      const actions = [
        consult && (
          <MRT_ActionMenuItem
            icon={<RemoveRedEye />}
            key="consult"
            label={Traduction("actions.details")}
            onClick={() => closeMenu()}
            table={table}
          />
        ),
        edit && (
          <FormWrapper
            matricule={itemId}
            row={row}
            typeOpt="MOD" // Indicate this is for modification
            key="edit"
          />
        ),
        remove && (
          <ActionMenu
            key="DeleteBox"
            contentOptions={BoxOptionDeleteBy1({ handleDelete, closeMenu, itemId, Traduction })}
          />
        ),
      ];
      return actions.filter(Boolean); // Remove falsy values
    },
    DownloadOption: Traduction("actions.download"),
    AddOption: Traduction("actions.add", { NomTable: PageTranslate[TableName] }),
    DeleteOption: Traduction("actions.deleteSelected", { NomTable: PageTranslate[TableName] }),
    RefreshOption: Traduction("actions.RefreshData"),
    TableOptions: {
      enableColumnResizing: true,
      enableColumnDragging: true,
      enableColumnOrdering: true,
      enableColumnFilters: true,
      enableColumnFilterModes: true,
      enableColumnPinning: true,
      enableColumnVirtualization: true,
      enableRowActions: true,
      enableSelectAll: true,
      enableColumnActions: true,
      enableRowDragging: true,
      enableRowOrdering: true,
      enableRowNumbers: true,
      enableGrouping: true,
      enableSortingRemoval: true,
      enableRowPinning: true,
      enableRowVirtualization: true,
      enableClickToCopy: true,
      enableToolbarInternalActions: true,
      enableRowSelection: true,
    },
    TableName,
  };
};