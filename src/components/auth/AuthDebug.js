import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';

function decodeJWT(token) {
  try {
    const b64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(b64));
  } catch (e) {
    return null;
  }
}

export default function AuthDebug() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [me, setMe] = useState(null);

  useEffect(() => {
    window.showAuthInfo = async () => {
      const token = localStorage.getItem('access_token') || localStorage.getItem('token');
      const result = { tokenPresent: !!token, jwt: null, me: null };
      if (token) result.jwt = decodeJWT(token);
      try {
        if (token) {
          const res = await fetch('/auth/me', { headers: { Authorization: 'Bearer ' + token } });
          result.me = res.ok ? await res.json() : { status: res.status, text: await res.text() };
        }
      } catch (e) {
        result.me = 'fetch failed: ' + e.message;
      }
      console.log('showAuthInfo:', result);
      return result;
    };
  }, []);

  const onOpen = async () => {
    setOpen(true);
    try {
      const token = localStorage.getItem('access_token') || localStorage.getItem('token');
      if (token) {
        const res = await fetch('/auth/me', { headers: { Authorization: 'Bearer ' + token } });
        setMe(res.ok ? await res.json() : { status: res.status, text: await res.text() });
      } else setMe(null);
    } catch (e) { setMe('fetch failed: ' + e.message); }
  };

  return (
    <>
      <Button size="small" color="inherit" onClick={onOpen}>Auth Debug</Button>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Auth Debug (dev only)</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2">AuthContext user:</Typography>
            <pre>{JSON.stringify(user, null, 2)}</pre>
          </Box>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2">Decoded JWT payload (if present):</Typography>
            <pre>{JSON.stringify(decodeJWT(localStorage.getItem('access_token') || localStorage.getItem('token')), null, 2)}</pre>
          </Box>
          <Box>
            <Typography variant="subtitle2">/auth/me response (server):</Typography>
            <pre>{JSON.stringify(me, null, 2)}</pre>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
