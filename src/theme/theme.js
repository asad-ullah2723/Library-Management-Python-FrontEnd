import { createTheme } from '@mui/material/styles';

export const getDesignTokens = (mode) => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          primary: { main: '#0F172A' },
          background: { default: '#f4f6f8', paper: '#fff' },
        }
      : {
          primary: { main: '#64b5f6' },
          background: { default: '#071022', paper: '#0b1522' },
          divider: '#16232b',
          text: { primary: '#e6eef8', secondary: '#9fb0c6' },
        }),
  },
  typography: {
    fontFamily: 'Inter, Roboto, Helvetica, Arial, sans-serif',
    fontSize: 14,
    h6: { fontSize: '1.05rem' },
  },
});

export default function createAppTheme(mode = 'dark') {
  return createTheme(getDesignTokens(mode));
}
