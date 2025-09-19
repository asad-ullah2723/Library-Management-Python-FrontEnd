import React, { useEffect, useState } from 'react';
import { Box, Grid, Paper, Typography, Button, CircularProgress } from '@mui/material';
import reportsService from '../../services/reportsService';
import { useNavigate } from 'react-router-dom';

export default function ReportsOverview() {
  const [loading, setLoading] = useState(false);
  const [daily, setDaily] = useState(null);
  const [mostBorrowed, setMostBorrowed] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const d = await reportsService.getDailyActivity(7);
        setDaily(d.data || d);
      } catch (err) { console.error(err); }
      try {
        const mb = await reportsService.getMostBorrowed(5);
        setMostBorrowed(mb.data || mb);
      } catch (err) { console.error(err); }
      setLoading(false);
    };
    load();
  }, []);

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Reports Overview</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2">Today's Issued</Typography>
            <Typography variant="h6">{daily ? (daily[0]?.issued ?? '-') : <CircularProgress size={18} />}</Typography>
            <Button size="small" onClick={() => navigate('/system-logs')}>Open Reports</Button>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2">Today's Returned</Typography>
            <Typography variant="h6">{daily ? (daily[0]?.returned ?? '-') : <CircularProgress size={18} />}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2">Most Borrowed (Top 5)</Typography>
            <ol>
              {mostBorrowed.map((b) => (
                <li key={b.book_id}>{b.title} ({b.borrow_count})</li>
              ))}
            </ol>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
