import { useContext, useState } from 'react';
import ActionMenu from '../menu/ActionMenu'; // Adjust path to match your project structure
import MultiStepForm from './Form'; // Adjust path to match your MultiStepForm location
import { useTranslation } from 'react-i18next';
import { MainContext } from '../../utils/contexts/MainContext';
import { getFromActionMenu } from './options/FormActionMenuOption';

const FormWrapper = ({ matricule = null, row = null, typeOpt = 'ADD' }) => {
  const { t: Traduction } = useTranslation();
  const { TableName } = useContext(MainContext);
  const [buttons, setButtons] = useState([]);

  // Map TableName to the corresponding translation key
  const getTableTranslationKey = (tableName) => {
    const mapping = {
      'etudiants': 'student',
      'professeurs': 'prof',
      'matiere': 'subject',
      'niveaux': 'level',
      'salles': 'room',
      'groupes': 'group',
      'evaluations': 'evaluation',
      'regular-timetables': 'timetable'
    };
    return mapping[tableName] || 'student';
  };

  // Get the translated table name
  const tableNameTranslated = Traduction(`TableDBName.${getTableTranslationKey(TableName)}`);

  // Determine contentOptions based on typeOpt
  const actionMenuConfig = typeOpt === 'ADD'
    ? getFromActionMenu("actions.add", TableName, Traduction, tableNameTranslated).ADD
    : getFromActionMenu("actions.edit", TableName, Traduction, tableNameTranslated).UPDATE;

  const contentOptions = {
    Title: actionMenuConfig.Title, 
    Btns: buttons,
    MainBtn: actionMenuConfig.MainBtn,
  };

  return (
    <ActionMenu
      DialogContentComponent={<MultiStepForm matricule={matricule} row={row} setButtons={setButtons} />}
      contentOptions={contentOptions}
      fullWidth={true}
      maxWidth="lg"
      style={{ minHeight: '60vh' }}
      showOptions={true}
    />
  );
};

export default FormWrapper;