import { useContext } from 'react';
import { MainContext } from '../../utils/contexts/MainContext';
import { FormProvider } from './context/FormContext';
import FormStepper from './components/FormStepper';
import FormFields from './components/FormFields';
import FormActions from './components/FormActions';
import { GetSteps } from './Steps/SelectedSteps';

const MultiStepForm = ({ matricule = null, row = null, setButtons }) => {
  const { TableName } = useContext(MainContext);
    const steps = GetSteps(TableName);
  return (
    <FormProvider matricule={matricule} row={row}>
      <form>
        <FormStepper steps={steps} />
        <FormFields steps={steps} />
        <FormActions steps={steps} setButtons={setButtons} />
      </form>
    </FormProvider>
  );
};

export default MultiStepForm;
