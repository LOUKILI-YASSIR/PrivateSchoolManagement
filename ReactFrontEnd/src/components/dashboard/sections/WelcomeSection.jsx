import React from 'react';
import { 
  Paper, 
  Typography, 
  Box, 
  useTheme,
  alpha
} from '@mui/material';
import { School as SchoolIcon } from '@mui/icons-material';

const WelcomeSection = () => {
  const theme = useTheme();
  
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        mb: 3,
        background: theme.palette.mode === 'dark'
          ? `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0.2)} 0%, ${alpha(theme.palette.primary.main, 0.1)} 100%)`
          : `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.2)} 0%, ${alpha(theme.palette.primary.main, 0.1)} 100%)`,
        border: `1px solid ${theme.palette.mode === 'dark'
          ? alpha(theme.palette.primary.main, 0.2)
          : alpha(theme.palette.primary.main, 0.1)}`,
        borderRadius: 2,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.palette.mode === 'dark'
            ? `0 8px 24px ${alpha(theme.palette.primary.main, 0.2)}`
            : `0 8px 24px ${alpha(theme.palette.primary.main, 0.1)}`,
        }
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            bgcolor: theme.palette.mode === 'dark'
              ? alpha(theme.palette.primary.main, 0.2)
              : alpha(theme.palette.primary.main, 0.1),
            color: theme.palette.mode === 'dark'
              ? theme.palette.primary.light
              : theme.palette.primary.main,
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'scale(1.1)',
            }
          }}
        >
          <SchoolIcon sx={{ fontSize: 40 }} />
        </Box>
        <Box>
          <Typography 
            variant="h4" 
            sx={{ 
              mb: 1,
              color: theme.palette.mode === 'dark'
                ? theme.palette.common.white
                : theme.palette.text.primary,
              fontWeight: 700
            }}
          >
            Bienvenue dans votre Tableau de Bord
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              color: theme.palette.mode === 'dark'
                ? alpha(theme.palette.common.white, 0.7)
                : theme.palette.text.secondary
            }}
          >
            Gérez votre école efficacement avec notre système de gestion intégré
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default WelcomeSection; 