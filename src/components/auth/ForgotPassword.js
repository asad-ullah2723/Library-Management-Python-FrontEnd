import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Container, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Box, 
  Link as MuiLink,
  Alert,
  CircularProgress
} from '@mui/material';
import { Email as EmailIcon, Close as CloseIcon } from '@mui/icons-material';
import { IconButton } from '@mui/material';

const ForgotPassword = ({ dialog = false, onClose, onSwitch }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  const { forgotPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      return setError('Please enter your email address');
    }
    
    setError('');
    setMessage('');
    setLoading(true);
    
    try {
      const result = await forgotPassword(email);
      
      if (result?.success) {
        setMessage('If your email is registered, you will receive a password reset link');
      } else {
        // Handle both string and object error responses
        const errorMessage = typeof result?.error === 'object' 
          ? result.error.msg || 'Invalid email format'
          : result?.error || 'Failed to send reset email';
        setError(errorMessage);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Forgot password error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth={dialog ? false : 'xs'} sx={dialog ? { p: 0 } : {}}>
      <Paper elevation={3} sx={{ mt: dialog ? 0 : 8, p: dialog ? 3 : 4, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
        {dialog && typeof onClose === 'function' && (
          <IconButton onClick={onClose} size="small" sx={{ position: 'absolute', right: 8, top: 8 }}>
            <CloseIcon />
          </IconButton>
        )}
        <EmailIcon color="primary" sx={{ fontSize: 40, mb: 2 }} />
        <Typography component="h1" variant="h5">
          Forgot Password
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ width: '100%', mt: 2 }}>
            {error}
          </Alert>
        )}
        
        {message ? (
          <Alert severity="success" sx={{ width: '100%', mt: 2 }}>
            {message}
          </Alert>
        ) : (
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Enter your email address and we'll send you a link to reset your password.
            </Typography>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Send Reset Link'}
            </Button>
          </Box>
        )}
        
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          {dialog && typeof onSwitch === 'function' ? (
            <MuiLink component="button" onClick={() => onSwitch('login')} variant="body2" sx={{ cursor: 'pointer' }}>
              Back to Sign In
            </MuiLink>
          ) : (
            <MuiLink component={Link} to="/login" variant="body2">
              Back to Sign In
            </MuiLink>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default ForgotPassword;
