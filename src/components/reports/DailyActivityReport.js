import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography, CircularProgress, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import reportsService from '../../services/reportsService';

export default function DailyActivityReport({ days = 30 }) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await reportsService.getDailyActivity(days);
        setData(res.data || res);
      } catch (err) { console.error(err); }
      setLoading(false);
    };
    load();
  }, [days]);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>Daily Issued / Returned (last {days} days)</Typography>
      <Paper sx={{ p: 2 }}>
        {loading ? <CircularProgress /> : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Issued</TableCell>
                <TableCell>Returned</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((r) => (
                <TableRow key={r.date}>
                  <TableCell>{r.date}</TableCell>
                  <TableCell>{r.issued}</TableCell>
                  <TableCell>{r.returned}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>
    </Box>
  );
}
