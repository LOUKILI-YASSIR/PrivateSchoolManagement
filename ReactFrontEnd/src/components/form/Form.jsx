import { useContext } from 'react';
import { MainContext } from '../../utils/contexts/MainContext';
import { FormProvider, useFormContext } from './context/FormContext';
import FormStepper from './components/FormStepper';
import FormFields from './components/FormFields';
import FormActions from './components/FormActions';
import { GetSteps } from './Steps/SelectedSteps';
import { Snackbar, Alert } from '@mui/material';

const FormContent = ({ ExtraTableName = null ,refetch, matricule = null, row = null, setButtons, setUserInfo }) => {
  
  const { TableName = null } = useContext(MainContext) || {}; // make sure context is not null
  const formContext = useFormContext();
  const { notification, handleCloseNotification } = formContext;
  const steps = GetSteps(TableName ? TableName : ExtraTableName, formContext,row);
  
  return (
    <>
      <form>
        <FormStepper steps={steps}  />
        <FormFields steps={steps} row={row} matricule={matricule}/>
        <FormActions ExtraTableName={ExtraTableName} refetch={refetch} steps={steps} setButtons={setButtons} matricule={matricule} setUserInfo={setUserInfo} TypeOpt={row && typeof row === "object" ? "EDIT" : "ADD"}/>
      </form>
      {notification && (
        <Snackbar
          open={notification.open}
          autoHideDuration={6000}
          onClose={handleCloseNotification}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert 
            onClose={handleCloseNotification} 
            severity={notification.severity} 
            sx={{ width: '100%' }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      )}
    </>
  );
};

const MultiStepForm = (props) => {
  return (
    <FormProvider {...props}>
      <FormContent {...props} />
    </FormProvider>
  );
};

export default MultiStepForm;
