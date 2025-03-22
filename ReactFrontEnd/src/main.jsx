import { createRoot } from 'react-dom/client'
import App from './App.jsx';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import  Store  from "./Store/Store"
//import styles
import "./index.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/menu.css';
import './styles/tailwind.css';

import './utils/localization/i18n'; // Ensure this imports the i18n configuration for Traduction
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
const root = createRoot(document.getElementById('root'));
const queryClient = new QueryClient();


root.render(
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <Provider store={Store}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <App/>
        </Router>
      </QueryClientProvider>
    </Provider>
  </LocalizationProvider>
);


reportWebVitals();

