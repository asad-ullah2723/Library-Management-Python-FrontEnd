import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
  CircularProgress,
  IconButton,
  Snackbar
} from '@mui/material';
import { Lock as LockIcon, Close as CloseIcon } from '@mui/icons-material';

const Login = ({ dialog = false, onSwitch, onClose } ) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showSnackbar, setShowSnackbar] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    setLoading(true);
    
    try {
      const result = await login(email, password);
      
      if (result?.success) {
        if (dialog) {
          // show success message then close the overlay
          setSuccess('Signed in successfully');
          setShowSnackbar(true);
          // close after short delay so user sees the message
          setTimeout(() => {
            setShowSnackbar(false);
            if (typeof onClose === 'function') onClose();
          }, 900);
        } else {
          navigate('/');
        }
      } else {
        // Ensure we're setting a string error message
        const errorMessage = typeof result?.error === 'object' 
          ? result.error.message || 'Invalid credentials'
          : result?.error || 'Failed to log in';
        setError(errorMessage);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth={dialog ? false : 'xs'} sx={dialog ? { p: 0 } : {}}>
      <Paper
        elevation={3}
        sx={{
          mt: dialog ? 0 : 8,
          p: dialog ? 3 : 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
          bgcolor: dialog ? undefined : undefined,
          backdropFilter: dialog ? 'saturate(120%) blur(6px)' : undefined,
       bgcolor: dialog ? 'transparent' : undefined,
       backdropFilter: dialog ? 'saturate(120%) blur(6px)' : undefined,
       border: dialog ? '1px solid rgba(255,255,255,0.12)' : undefined,
          boxShadow: dialog ? '0 12px 36px rgba(0,0,0,0.28)' : undefined,
          color: dialog ? '#fff' : undefined,
        }}
      >
        {dialog && typeof onClose === 'function' && (
          <IconButton onClick={onClose} size="small" sx={{ position: 'absolute', right: 8, top: 8 }}>
            <CloseIcon />
          </IconButton>
        )}
        <LockIcon color="primary" sx={{ fontSize: 40, mb: 2 }} />
        <Typography component="h1" variant="h5" sx={{ color: dialog ? '#fff' : undefined }}>
          Sign in
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ width: '100%', mt: 2, color: dialog ? '#fff' : undefined, backgroundColor: dialog ? 'rgba(255,0,0,0.12)' : undefined }}>
            {error}
          </Alert>
        )}

        <Snackbar open={showSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} onClose={() => setShowSnackbar(false)} autoHideDuration={2000}>
          <Alert severity="success" sx={{ width: '100%' }}>
            {success}
          </Alert>
        </Snackbar>
        
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%', display: 'flex', justifyContent: 'center' }}>
          <Box sx={{ width: dialog ? 480 : '100%' }}>
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
            InputLabelProps={dialog ? { sx: { color: 'rgba(255,255,255,0.85)' } } : undefined}
            InputProps={dialog ? { sx: { color: '#fff', backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 1, '& .MuiInputBase-input::placeholder': { color: 'rgba(255,255,255,0.6)' } } } : undefined}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputLabelProps={dialog ? { sx: { color: 'rgba(255,255,255,0.85)' } } : undefined}
            InputProps={dialog ? { sx: { color: '#fff', backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 1, '& .MuiInputBase-input::placeholder': { color: 'rgba(255,255,255,0.6)' } } } : undefined}
          />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, bgcolor: '#0b1b2b', color: '#fff', '&:hover': { bgcolor: '#07121d' } }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Sign In'}
            </Button>

          </Box>
        </Box>

        <Box sx={{ textAlign: 'center', mt: 2 }}>
            {dialog ? (
              <MuiLink component="button" onClick={() => onSwitch && onSwitch('forgot')} variant="body2" sx={{ color: '#fff', cursor: 'pointer' }}>
                Forgot password?
              </MuiLink>
            ) : (
              <MuiLink component={Link} to="/forgot-password" variant="body2" sx={{ color: dialog ? '#fff' : undefined }}>
                Forgot password?
              </MuiLink>
            )}
          </Box>

          <Box sx={{ textAlign: 'center', mt: 2 }}>
            {dialog && typeof onSwitch === 'function' ? (
              <MuiLink component="button" onClick={() => onSwitch('register')} variant="body2" sx={{ cursor: 'pointer', color: dialog ? '#fff' : undefined }}>
                {"Don't have an account? Sign Up"}
              </MuiLink>
            ) : (
              <MuiLink component={Link} to="/register" variant="body2" sx={{ color: dialog ? '#fff' : undefined }}>
                {"Don't have an account? Sign Up"}
              </MuiLink>
            )}
          </Box>
      </Paper>
    </Container>
  );
};

export default Login;
