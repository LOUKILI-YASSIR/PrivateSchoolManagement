import React from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  CircularProgress, 
  Alert,
  Divider,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { useAuth } from '../../utils/contexts/AuthContext';
import { FaUser, FaEnvelope, FaPhone, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const UserProfileInfo = () => {
  const { user, loadingProfile, reloadUserProfile } = useAuth();

  // If still loading user profile
  if (loadingProfile) {
    return (
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress size={24} />
        <Typography variant="body2" sx={{ ml: 2 }}>
          Loading user profile...
        </Typography>
      </Box>
    );
  }

  // If user profile is not available
  if (!user) {
    return (
      <Alert severity="warning" sx={{ mt: 2 }}>
        User profile information is not available. Please log in again or refresh the page.
      </Alert>
    );
  }

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">User Profile Information</Typography>
          <Button 
            size="small" 
            variant="outlined"
            onClick={() => reloadUserProfile()}
          >
            Refresh
          </Button>
        </Box>
        
        <Divider sx={{ mb: 2 }} />
        
        <List>
          <ListItem>
            <ListItemIcon><FaUser /></ListItemIcon>
            <ListItemText 
              primary="Username" 
              secondary={user.username || 'Not set'} 
            />
          </ListItem>
          
          <ListItem>
            <ListItemIcon><FaEnvelope /></ListItemIcon>
            <ListItemText 
              primary="Email" 
              secondary={user.EmailUT || 'Not set'}
            />
          </ListItem>
          
          <ListItem>
            <ListItemIcon><FaPhone /></ListItemIcon>
            <ListItemText 
              primary="Phone" 
              secondary={user.phone || user.PhoneUT || 'Not set'}
            />
          </ListItem>
          
          <ListItem>
            <ListItemIcon>
              {user.google2fa_enabled ? <FaCheckCircle color="green" /> : <FaTimesCircle color="red" />}
            </ListItemIcon>
            <ListItemText 
              primary="2FA Status" 
              secondary={user.google2fa_enabled ? 'Enabled' : 'Disabled'}
            />
          </ListItem>
        </List>
        
        <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
          <Typography variant="caption" color="text.secondary">
            Last updated: {new Date().toLocaleString()}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default UserProfileInfo; 