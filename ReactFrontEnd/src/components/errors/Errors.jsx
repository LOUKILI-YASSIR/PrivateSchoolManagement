import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Typography, Button, Container, Paper } from '@mui/material';
import { useTranslation } from 'react-i18next';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import HomeIcon from '@mui/icons-material/Home';
import RefreshIcon from '@mui/icons-material/Refresh';
import SecurityIcon from '@mui/icons-material/Security';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import ServerErrorIcon from '@mui/icons-material/CloudOff';

const ErrorPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  
  // Get error type from location state or default to 404
  const errorType = location.state?.errorType || '404';
  
  const errorConfig = {
    '404': {
      icon: <SearchOffIcon sx={{ fontSize: 100, color: '#f44336' }} />,
      title: t('errors.404.title', 'Page Not Found'),
      message: t('errors.404.message', 'The page you are looking for does not exist or has been moved.'),
      action: {
        label: t('errors.404.action', 'Go to Home'),
        icon: <HomeIcon />,
        onClick: () => navigate('/YLSchool/Dashboard')
      }
    },
    '403': {
      icon: <SecurityIcon sx={{ fontSize: 100, color: '#ff9800' }} />,
      title: t('errors.403.title', 'Access Denied'),
      message: t('errors.403.message', 'You do not have permission to access this page.'),
      action: {
        label: t('errors.403.action', 'Go Back'),
        icon: <HomeIcon />,
        onClick: () => navigate(-1)
      }
    },
    '500': {
      icon: <ServerErrorIcon sx={{ fontSize: 100, color: '#d32f2f' }} />,
      title: t('errors.500.title', 'Server Error'),
      message: t('errors.500.message', 'Something went wrong on our end. Please try again later.'),
      action: {
        label: t('errors.500.action', 'Refresh Page'),
        icon: <RefreshIcon />,
        onClick: () => window.location.reload()
      }
    },
    'network': {
      icon: <ErrorOutlineIcon sx={{ fontSize: 100, color: '#2196f3' }} />,
      title: t('errors.network.title', 'Network Error'),
      message: t('errors.network.message', 'Please check your internet connection and try again.'),
      action: {
        label: t('errors.network.action', 'Retry'),
        icon: <RefreshIcon />,
        onClick: () => window.location.reload()
      }
    },
    'default': {
      icon: <ErrorOutlineIcon sx={{ fontSize: 100, color: '#9e9e9e' }} />,
      title: t('errors.default.title', 'Oops! Something went wrong'),
      message: t('errors.default.message', 'An unexpected error occurred. Please try again.'),
      action: {
        label: t('errors.default.action', 'Go to Home'),
        icon: <HomeIcon />,
        onClick: () => navigate('/YLSchool/Dashboard')
      }
    }
  };

  const config = errorConfig[errorType] || errorConfig.default;

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          py: 4
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            width: '100%'
          }}
        >
          {config.icon}
          
          <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 2 }}>
            {config.title}
          </Typography>
          
          <Typography variant="body1" color="text.secondary" paragraph>
            {config.message}
          </Typography>
          
          <Button
            variant="contained"
            color="primary"
            startIcon={config.action.icon}
            onClick={config.action.onClick}
            sx={{ mt: 2 }}
          >
            {config.action.label}
          </Button>
        </Paper>
      </Box>
    </Container>
  );
};

export default ErrorPage;
