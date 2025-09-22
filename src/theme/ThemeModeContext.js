import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeModeContext = createContext(null);

export const ThemeModeProvider = ({ children }) => {
  const [mode, setMode] = useState(() => {
    try {
      const saved = localStorage.getItem('theme_mode');
      return saved || 'dark';
    } catch (e) {
      return 'dark';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('theme_mode', mode);
    } catch (e) {}
  }, [mode]);

  const toggleMode = () => setMode((m) => (m === 'dark' ? 'light' : 'dark'));

  return (
    <ThemeModeContext.Provider value={{ mode, toggleMode }}>
      {children}
    </ThemeModeContext.Provider>
  );
};

export const useThemeMode = () => {
  const ctx = useContext(ThemeModeContext);
  if (!ctx) throw new Error('useThemeMode must be used within ThemeModeProvider');
  return ctx;
};

export default ThemeModeContext;
