import { useContext, useState } from 'react';
import ActionMenu from '../Menu/ActionMenu'; // Adjust path to match your project structure
import MultiStepForm from './Form'; // Adjust path to match your MultiStepForm location
import { useTranslation } from 'react-i18next';
import { MainContext } from '../../utils/contexts/MainContext';
import { getFromActionMenu } from './options/FormActionMenuOption';

const FormWrapper = ({ matricule = null, row = null, typeOpt = 'ADD' }) => {
  const { t: Traduction } = useTranslation();
  const { TableName } = useContext(MainContext);
  const [buttons, setButtons] = useState([]);

  const updateButtons = ({ currentStep, totalSteps, nextStep, prevStep, submitForm }) => {
    const btns = [];

    if (currentStep > 0) {
      btns.push({
        value: 'Précédent',
        handleClick: prevStep,
      });
    }

    if (currentStep < totalSteps - 1) {
      btns.push({
        value: 'Suivant',
        handleClick: nextStep,
      });
    } else {
      btns.push({
        value: 'Soumettre',
        handleClick: submitForm,
      });
    }

    btns.push({
      value: 'Annuler',
      handleClose: true,
    });

    setButtons(btns);
  };

  // Determine contentOptions based on typeOpt
  const actionMenuConfig = typeOpt === 'ADD'
    ? getFromActionMenu("actions.add" ,TableName).ADD
    : getFromActionMenu("actions.edit",TableName).UPDATE;

  const contentOptions = {
    Title: actionMenuConfig.Title, // e.g., "Inscription d'un Etudiant" or "Modification d'un Etudiant"
    Btns: buttons,
    MainBtn: actionMenuConfig.MainBtn, // Reuse the styled button from getFromActionMenu
  };

  return (
    <ActionMenu
      DialogContentComponent={<MultiStepForm matricule={matricule} row={row} setButtons={updateButtons} />}
      contentOptions={contentOptions}
      isTitleH1={true}
      isFormWidth={true}
    />
  );
};

export default FormWrapper;