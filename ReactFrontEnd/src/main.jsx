import { createRoot } from 'react-dom/client'
import App from './App.jsx';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './utils/contexts/AuthContext';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import Store from "./Store/Store"
//import styles
import "./styles/Menu.css";
import "./styles/index.css";
import 'bootstrap/dist/css/bootstrap.min.css';

import './styles/tailwind.css';

import './utils/localization/i18n'; // Ensure this imports the i18n configuration for Traduction
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
const root = createRoot(document.getElementById('root'));
const queryClient = new QueryClient();

// Create a custom MUI theme
const theme = createTheme({
  components: {
    MuiFormLabel: {
      styleOverrides: {
        root: {
          '&.Mui-focused': {
            // This will be overridden at component level with more specific styles
            color: 'inherit',
          },
        },
      },
    },
  },
});

// Enable React Router v7 features
const v7Features = {
  v7_startTransition: true,
  v7_relativeSplatPath: true
};

root.render(
  <ThemeProvider theme={theme}>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Provider store={Store}>
        <QueryClientProvider client={queryClient}>
          <Router future={v7Features}>
            <AuthProvider>
              <App/>
            </AuthProvider>
          </Router>
        </QueryClientProvider>
      </Provider>
    </LocalizationProvider>
  </ThemeProvider>
);

reportWebVitals();

