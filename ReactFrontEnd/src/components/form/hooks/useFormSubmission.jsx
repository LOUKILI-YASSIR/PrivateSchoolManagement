import { useFormContext } from '../context/FormContext';
import apiServices from '../../../api/apiServices';
import { useTranslation } from 'react-i18next';
import { useFetchData } from '../../../api/queryHooks';
import { message } from 'antd';

export const useFormSubmission = ({ExtraTableName,TypeOpt,matricule}) => {
  const { TableName = '', setUserInfo, formMethods } = useFormContext() ;
  const { t: Traduction } = useTranslation();
  const { data: academicYears } = useFetchData("academic-years");
  
  const getCurrentYear = () => {
    if (!academicYears?.data) return null;
    // Check if data is an array, if not, try to access the data property
    const yearsArray = Array.isArray(academicYears.data) ? academicYears.data : academicYears.data.data;
    if (!Array.isArray(yearsArray)) return null;
    return yearsArray.find(year => year.IsCurrentYR === true);
  };

  const onSubmit = async (data) => {
    try {

      // Convert TableName to the correct API endpoint format
      const endpoint = ExtraTableName || TableName?.toLowerCase()?.replace(/\s+/g, '-') || '';
      const currentYear = getCurrentYear();
      if (!currentYear && TableName !== "academic-years" && TableName !== 'evaluation-types') {
        throw new Error(Traduction('No current academic year found'));
      }
      // Add required fields for student creation
      if (TableName === 'etudiants' || TableName === 'professeurs') {


        // Format the date to YYYY-MM-DD
        const formattedData = {
          ...data,
          DateNaissancePL: data.DateNaissancePL ? new Date(data.DateNaissancePL).toISOString().split('T')[0] : null,
          MatriculeYR: currentYear.MatriculeYR, // Current academic year
        };

        // Submit the form data to the 
        console.log("1Formatted Data: ", formattedData);
        const response = TypeOpt === "ADD" && !matricule ?
                          await apiServices.postData(endpoint, formattedData) :
                          await apiServices.updateData(endpoint, matricule, formattedData);
        
        // Check for error in response
        if (response?.error) {
          throw new Error(response.message || Traduction('Error submitting form'));
        }

        // Handle user info if present in response
        if (response?.data?.userInfo) {
          setUserInfo(response.data.userInfo);
        }

        // Show success message
        message.success(Traduction('Form submitted successfully'));
        return response;
      } else {
        const buildPayload = (data) => {
  const result = { ...data }; // copy original data
  const evaluations = [];

  for (let i = 0; i <= Number(data["NbrEVMT"]); i++) {
    const nbrKey = `NbrEV_${i}`;
    const MatriculeKey = `MatriculeEP_${i}`;
    const val = data[nbrKey];
    const val2 = data[MatriculeKey];

    if (val !== undefined && val !== "" && val2 !== undefined && val2 !== "") {
      evaluations.push({
        NbrEV: val,
        MatriculeEP: data[MatriculeKey] || "" // or leave empty ""
      });
    }

    delete result[nbrKey]; // remove from result
    delete result[MatriculeKey]; // remove from result
  }

  result.Evaluations = evaluations;
  return result;

        };

        // Format the date to YYYY-MM-DD
        const formattedData = TableName === "academic-years" ? 
        {
          ...data,
          MatriculeUT: sessionStorage.getItem("userID")
        } : TableName === "matieres" ? {
          ...buildPayload(data),
          professeurs: data?.professeurs ? data?.professeurs?.map(p=>({MatriculePR:p})) || [] : [],
          MatriculeYR: currentYear.MatriculeYR, // Current academic year
        } : TableName !== 'evaluation-types' ? {
          ...data,
          MatriculeYR: currentYear.MatriculeYR, // Current academic year
        } : {...data};
        console.log("Formatted Data: ", formattedData);
        // For other forms, submit as is
        const response = TypeOpt === "ADD" && !matricule  ?
                          await apiServices.postData(endpoint, formattedData) :
                          await apiServices.updateData(endpoint, matricule, formattedData);
        console.log("formattedData",formattedData)
        if (response?.error) {
          throw new Error(response.message || Traduction('Error submitting form'));
        }
        
        if (response?.formattedData?.userInfo) {
          setUserInfo(response.formattedData.userInfo);
        }
        message.success(Traduction('Form submitted successfully'));
        
        return response;
      }
    } catch (error) {
      // Handle error and show error message
      console.error('Form submission error:', error);
      
      // Show error message from API or fallback to generic message
      const errorMessage = error?.response?.data?.message || error?.message || Traduction('Error submitting form');
      message.error(errorMessage);
      
      throw error;
    }
  };

  const handleSubmit = formMethods.handleSubmit(onSubmit);

  return {
    handleSubmit,
    formMethods
  };
};