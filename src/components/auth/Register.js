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
  Grid,
  InputAdornment,
  IconButton,
  LinearProgress,
  Snackbar
} from '@mui/material';
import { PersonAdd as PersonAddIcon, Visibility, VisibilityOff, Close as CloseIcon } from '@mui/icons-material';

const Register = ({ dialog = false, onSwitch, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const { name, email, password, confirmPassword } = formData;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }
    
    if (password.length < 8) {
      return setError('Password must be at least 8 characters long');
    }
    
    if (!name || !email) {
      return setError('Please fill in all required fields');
    }
    
    setError('');
    setLoading(true);
    
    try {
      const { success, error } = await register({ 
        full_name: name.trim(),
        email: email.trim().toLowerCase(),
        password: password.trim()
      });
      
      if (success) {
        // If rendered inside a dialog, switch to login view; otherwise navigate to login route
        const successMsg = 'Registration successful! Please check your email to verify your account before logging in.';
        if (dialog && typeof onSwitch === 'function') {
          // switch to login view inside the dialog and show a small snackbar
          onSwitch('login');
          setSnack({ open: true, message: successMsg, severity: 'success' });
        } else {
          navigate('/login', { 
            state: { 
              message: successMsg
            } 
          });
        }
      } else {
        setError(error || 'Failed to register. Please try again.');
      }
    } catch (err) {
      console.error('Registration error:', err);
      const errorMsg = err.response?.data?.detail || 'An unexpected error occurred. Please try again.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const toggleShowPassword = () => setShowPassword(v => !v);
  const toggleShowConfirmPassword = () => setShowConfirmPassword(v => !v);

  const passwordStrength = (pwd) => {
    if (!pwd) return 0;
    let score = 0;
    if (pwd.length >= 8) score += 40;
    if (/[A-Z]/.test(pwd)) score += 20;
    if (/[0-9]/.test(pwd)) score += 20;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 20;
    return Math.min(100, score);
  };

  const strength = passwordStrength(formData.password);

  return (
    <Container component="main" maxWidth={dialog ? false : 'sm'} sx={dialog ? { p: 0 } : {}}>
      <Paper
        elevation={3}
        sx={{
          mt: dialog ? 0 : 8,
          p: dialog ? 3 : 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
          bgcolor: dialog ? 'rgba(255,255,255,0.12)' : undefined,
          backdropFilter: dialog ? 'saturate(150%) blur(8px)' : undefined,
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
        <PersonAddIcon color="primary" sx={{ fontSize: 40, mb: 2 }} />
        <Typography component="h1" variant="h5" sx={{ color: dialog ? '#fff' : undefined }}>
          Create an account
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ width: '100%', mt: 2, color: dialog ? '#fff' : undefined, backgroundColor: dialog ? 'rgba(255,0,0,0.12)' : undefined }}>
            {error}
          </Alert>
        )}
        
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, width: '100%', display: 'flex', justifyContent: 'center' }}>
          <Box sx={{ width: dialog ? { xs: '90%', sm: 480 } : '100%' }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                autoComplete="name"
                name="name"
                required
                fullWidth
                id="name"
                label="Full Name"
                autoFocus
                value={name}
                onChange={handleChange}
                InputLabelProps={dialog ? { sx: { color: 'rgba(255,255,255,0.85)' } } : undefined}
                InputProps={dialog ? { sx: { color: '#fff', backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 1, '& .MuiInputBase-input::placeholder': { color: 'rgba(255,255,255,0.6)' } } } : undefined}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={email}
                onChange={handleChange}
                InputLabelProps={dialog ? { sx: { color: 'rgba(255,255,255,0.85)' } } : undefined}
                InputProps={dialog ? { sx: { color: '#fff', backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 1, '& .MuiInputBase-input::placeholder': { color: 'rgba(255,255,255,0.6)' } } } : undefined}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="new-password"
                value={password}
                onChange={handleChange}
                helperText="Minimum 8 characters. Include numbers and special chars for stronger password."
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={toggleShowPassword} edge="end" size="small">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                InputLabelProps={dialog ? { sx: { color: 'rgba(255,255,255,0.85)' } } : undefined}
                sx={dialog ? { input: { color: '#fff' } } : undefined}
              />
              {formData.password && (
                <Box sx={{ width: '100%', mt: 1 }}>
                  <LinearProgress variant="determinate" value={strength} sx={{ height: 8, borderRadius: 1 }} />
                  <Typography variant="caption" color={dialog ? '#fff' : 'text.secondary'}>Strength: {strength < 50 ? 'Weak' : strength < 80 ? 'Good' : 'Strong'}</Typography>
                </Box>
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                value={confirmPassword}
                onChange={handleChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={toggleShowConfirmPassword} edge="end" size="small">
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                InputLabelProps={dialog ? { sx: { color: 'rgba(255,255,255,0.85)' } } : undefined}
                sx={dialog ? { input: { color: '#fff' } } : undefined}
              />
            </Grid>
          </Grid>
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, bgcolor: '#0b1b2b', color: '#fff', '&:hover': { bgcolor: '#07121d' } }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Sign Up'}
          </Button>
          
          <Box sx={{ textAlign: 'center' }}>
            {dialog && typeof onSwitch === 'function' ? (
              <MuiLink component="button" onClick={() => onSwitch('login')} variant="body2" sx={{ cursor: 'pointer', color: dialog ? '#fff' : undefined }}>
                Already have an account? Sign in
              </MuiLink>
            ) : (
              <MuiLink component={Link} to="/login" variant="body2" sx={{ color: dialog ? '#fff' : undefined }}>
                Already have an account? Sign in
              </MuiLink>
            )}
          </Box>
          </Box>
        </Box>
      </Paper>
      <Snackbar open={snack.open} autoHideDuration={4000} onClose={() => setSnack(s => ({ ...s, open: false }))}>
        <Alert severity={snack.severity} onClose={() => setSnack(s => ({ ...s, open: false }))} sx={{ width: '100%' }}>
          {snack.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Register;
