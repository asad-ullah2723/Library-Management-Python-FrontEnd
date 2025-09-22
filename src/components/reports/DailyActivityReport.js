import React, { useEffect, useState, useMemo } from 'react';
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Alert,
  Stack,
} from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import reportsService from '../../services/reportsService';

function toCSV(rows = []) {
  if (!rows.length) return '';
  const headers = Object.keys(rows[0]);
  const lines = [headers.join(',')];
  for (const r of rows) {
    const vals = headers.map((h) => {
      const v = r[h];
      if (v == null) return '';
      return String(v).includes(',') ? `"${String(v).replace(/"/g, '""')}"` : String(v);
    });
    lines.push(vals.join(','));
  }
  return lines.join('\n');
}

export default function DailyActivityReport({ days = 30 }) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await reportsService.getDailyActivity(days);
        const payload = res?.data ?? res;
        if (mounted) setData(Array.isArray(payload) ? payload : []);
      } catch (err) {
        console.error('DailyActivityReport load error', err);
        if (mounted) setError(err?.response?.data?.detail || err.message || 'Failed to load report');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [days]);

  const csv = useMemo(() => toCSV(data), [data]);

  const onDownload = () => {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.setAttribute('download', `daily-activity-${days}d.csv`);
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
        <Typography variant="h6">Daily Issued / Returned (last {days} days)</Typography>
        <Button
          startIcon={<FileDownloadIcon />}
          onClick={onDownload}
          disabled={loading || !data.length}
          size="small"
        >
          Export CSV
        </Button>
      </Stack>

      <Paper sx={{ p: 2 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : !data.length ? (
          <Alert severity="info">No activity recorded for the selected period.</Alert>
        ) : (
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
                  <TableCell>{r.issued ?? 0}</TableCell>
                  <TableCell>{r.returned ?? 0}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>
    </Box>
  );
}
