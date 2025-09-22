import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { AuthProvider } from './contexts/AuthContext';
import AppLayout from './components/layout/AppLayout';
import createAppTheme from './theme/theme';
import { ThemeModeProvider, useThemeMode } from './theme/ThemeModeContext';

const AppInner = () => {
  const { mode } = useThemeMode();
  const theme = createAppTheme(mode);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppLayout />
    </ThemeProvider>
  );
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <ThemeModeProvider>
          <AppInner />
        </ThemeModeProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
