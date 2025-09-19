import React, { useState } from 'react';
import { Box, Typography, Button, TextField, Paper, Grid, CircularProgress, Alert } from '@mui/material';
import api from '../../services/api';

export default function SystemLogsReports() {
  const [loading, setLoading] = useState(false);
  const [health, setHealth] = useState(null);
  const [logs, setLogs] = useState('');
  const [error, setError] = useState(null);

  const checkHealth = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await api.get('/health');
      setHealth(res.data || res);
    } catch (err) {
      setError(err?.response?.data?.detail || err.message || 'Failed to reach server');
      setHealth(null);
    } finally { setLoading(false); }
  };

  const fetchLogs = async () => {
    setError(null);
    setLoading(true);
    try {
      // backend may or may not expose /logs; handle gracefully
      const res = await api.get('/logs');
      setLogs(JSON.stringify(res.data || res, null, 2));
    } catch (err) {
      setError(err?.response?.data?.detail || err.message || 'Failed to fetch logs');
      setLogs('');
    } finally { setLoading(false); }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>System Logs & Reports</Typography>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <Button variant="contained" onClick={checkHealth} disabled={loading}>Check Health</Button>
          </Grid>
          <Grid item>
            <Button variant="outlined" onClick={fetchLogs} disabled={loading}>Fetch Logs</Button>
          </Grid>
          <Grid item>
            {loading && <CircularProgress size={20} />}
          </Grid>
        </Grid>
        {error && <Alert severity="error" sx={{ mt: 2 }}>{String(error)}</Alert>}
        {health && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1">Health</Typography>
            <pre style={{ whiteSpace: 'pre-wrap' }}>{typeof health === 'string' ? health : JSON.stringify(health, null, 2)}</pre>
          </Box>
        )}
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Typography variant="subtitle1" gutterBottom>Logs / Paste</Typography>
        <TextField
          value={logs}
          onChange={(e) => setLogs(e.target.value)}
          multiline
          rows={12}
          fullWidth
          placeholder="Fetched logs appear here, or paste logs for inspection"
        />
      </Paper>
    </Box>
  );
}
