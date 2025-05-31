import { useFormContext } from '../context/FormContext';
import apiServices from '../../../api/apiServices';
import { useTranslation } from 'react-i18next';
import { useFetchData } from '../../../api/queryHooks';
import { message } from 'antd';

export const useFormSubmission = ({TypeOpt,matricule}) => {
  const { TableName, setUserInfo, formMethods } = useFormContext();
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
      const endpoint = TableName.toLowerCase().replace(/\s+/g, '-');
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
        
        // Format the date to YYYY-MM-DD
        const formattedData = TableName === "academic-years" ? 
        {
          ...data,
          MatriculeUT: sessionStorage.getItem("userID")
        } : TableName !== 'evaluation-types' ? {
          ...data,
          MatriculeYR: currentYear.MatriculeYR, // Current academic year
        } : {...data};
        // For other forms, submit as is
        const response = TypeOpt === "ADD" && !matricule  ?
                          await apiServices.postData(endpoint, formattedData) :
                          await apiServices.updateData(endpoint, matricule, formattedData);
        
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