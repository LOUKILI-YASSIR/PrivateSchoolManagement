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
import ActionMenu from "../../menu/ActionMenu";
import { useSelector } from "react-redux";
import dayjs from 'dayjs';
export const GetInfoTable = ( userRole) => {
  const { t: Traduction, i18n } = useTranslation();
  const Language = i18n.language;
  const isDarkMode = useSelector((state) => state?.theme?.darkMode || false);
  const ValueMainContext = useContext(MainContext);
  if (!ValueMainContext) return {}; // Handle undefined context gracefully
  const { TableName } = ValueMainContext;

  const PageTranslate = {
    etudiants: Traduction("TableDBName.student"),
    professeurs: Traduction("TableDBName.prof"),
    matiere: Traduction("TableDBName.subject"),
    niveaux: Traduction("TableDBName.level"),
    salles: Traduction("TableDBName.room"),
    groups: Traduction("TableDBName.group"),
    evaluations: Traduction("TableDBName.evaluation"),
    "regular-timetables": Traduction("TableDBName.timetable")
  };

  return {
    LanguageOption: {
      fr: MRT_Localization_FR,
      en: MRT_Localization_EN,
      de: MRT_Localization_DE,
      es: MRT_Localization_ES,
    }[Language],
    ActionOption: (table, row, Handels, closeMenu, BoxOptionDeleteBy1, BoxOptionGrade, refetch, options = { consult: true, edit: true, remove: true }) => {
      const { consult, edit, remove } = options;
      const { handleDelete, handleSetGrade } = Handels;

      switch (TableName) {
        case 'etudiants':
          row={
            MatriculeET:row.MatriculeET,
            EmailET: row?.user?.EmailUT,
            EmailTR:row?.EmailTR,
            LienParenteTR:row.LienParenteTR,
            MatriculeGP:row.MatriculeGP,
            MatriculeNV:row.MatriculeNV,
            NomTR:row.NomTR,
            ObservationTR:row.ObservationTR,
            Phone1TR:row.Phone1TR,
            Phone2TR:row.Phone2TR,
            PhoneET:row?.user?.PhoneUT,
            PrenomTR:row.PrenomTR,
            ProfessionTR:row.ProfessionTR,
            ...(row?.user ? row.user : {}),
            DateNaissancePL:dayjs(row?.user?.DateNaissancePL),
          }
          break
        case 'professeurs': 
          row = {
            daily_hours_limit: row.daily_hours_limit,
            MatriculePR:row.MatriculePR,
            EmailPR: row?.user?.EmailUT,
            PhonePR:row?.user?.PhoneUT,
            MatriculeMT:row.MatriculeMT,
            CivilitePR:row.CivilitePR,
            DateEmbauchePR:row.DateEmbauchePR,
            NomBanquePR:row.NomBanquePR,
            RIBPR:row.RIBPR,
            SalairePR:row.SalairePR,
            CINPR:row.CINPR,
            ...(row?.user ? row.user : {}),
            DateNaissancePL:dayjs(row?.user?.DateNaissancePL),
          }
          break
        case "matieres":
          row = {
            ...row,
            NbrEVMT: row?.total_evaluations,
          };
        
          for (let i = 0; i < row?.total_evaluations; i++) {
            row[`MatriculeEP_${i}`] = row?.evaluations?.[i]?.MatriculeEP;
            row[`NbrEV_${i}`] = row?.evaluations?.[i]?.NbrEV;
          }
          break;

      }
      const itemId = row[{
        etudiants: "MatriculeET",
        professeurs: "MatriculePR",
        matieres: "MatriculeMT",
        niveaux: "MatriculeNV",
        salles: "MatriculeSL",
        groups: "MatriculeGP",
        "evaluation-types": "MatriculeEP",
        "regular-timetables": "MatriculeRT",
        "academic-years" : "MatriculeYR"
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
            refetch={refetch}
            typeOpt="MOD" // Indicate this is for modification
            key="edit"
            maxWidth="lg"
            fullWidth={true}
            style={{ minHeight: '60vh' }}
            showOptions={true}
          />
        ),
        remove && (
          <ActionMenu
            key="DeleteBox"
            fullWidth={true}
            contentOptions={BoxOptionDeleteBy1({ handleDelete, closeMenu, itemId, Traduction })}
            maxWidth="lg"
            disableBackdropClick={false}
            style={{ 
              width: '70vh',
              borderLeft: isDarkMode ? '3px solid rgba(220, 38, 38, 0.8)' : '3px solid rgba(220, 38, 38, 0.7)' 
            }}
          />
        ),
        TableName === "groups" && (
          <ActionMenu
            key="GradeBox"
            fullWidth={true}
            contentOptions={BoxOptionGrade({ closeMenu, itemId, Traduction })}
            maxWidth="lg"
            disableBackdropClick={false}
            style={{ 
              width: '70vh',
              borderLeft: isDarkMode ? '3px solid rgba(220, 38, 38, 0.8)' : '3px solid rgba(220, 38, 38, 0.7)' 
            }}
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
      enableRowActions:  userRole === "admin",
      enableSelectAll:  userRole === "admin",
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
      enableRowSelection:  userRole === "admin",
    },
    TableName,
  };
};