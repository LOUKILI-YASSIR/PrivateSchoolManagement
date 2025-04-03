import { useNavigate } from 'react-router-dom';

export const handleError = (error, navigate) => {
  // Handle network errors
  if (!navigator.onLine) {
    navigate('/YLSchool/error', { state: { errorType: 'network' } });
    return;
  }

  // Handle HTTP errors
  if (error.response) {
    switch (error.response.status) {
      case 404:
        navigate('/YLSchool/error', { state: { errorType: '404' } });
        break;
      case 403:
        navigate('/YLSchool/error', { state: { errorType: '403' } });
        break;
      case 500:
        navigate('/YLSchool/error', { state: { errorType: '500' } });
        break;
      default:
        navigate('/YLSchool/error', { state: { errorType: 'default' } });
    }
  } else {
    // Handle other types of errors
    navigate('/YLSchool/error', { state: { errorType: 'default' } });
  }
};

// Custom hook for error handling
export const useErrorHandler = () => {
  const navigate = useNavigate();
  
  return (error) => {
    handleError(error, navigate);
  };
}; 