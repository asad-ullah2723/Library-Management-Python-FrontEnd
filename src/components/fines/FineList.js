import React, { useEffect, useState } from 'react';
import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Dialog, CircularProgress } from '@mui/material';
import FineForm from './FineForm';
import fineService from '../../services/fineService';

export default function FineList() {
  const [fines, setFines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [limit] = useState(20);
  const [formOpen, setFormOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await fineService.listFines({ skip: page * limit, limit });
      setFines(res.data || res);
    } catch (err) {
      console.error('Failed to load fines', err);
      setFines([]);
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { fetch(); }, [page]);

  const openCreate = () => { setSelected(null); setFormOpen(true); };
  const openEdit = (f) => { setSelected(f); setFormOpen(true); };
  const handleFormClose = (refresh) => { 
    setFormOpen(false); 
    setSelected(null); 
    if (refresh) fetch(); 
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5">Fines</Typography>
        <Button variant="contained" onClick={openCreate}>Add Fine</Button>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" py={4}><CircularProgress /></Box>
      ) : (
        fines.length === 0 ? (
          <Typography align="center" py={4}>No fines found</Typography>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Fine ID</TableCell>
                  <TableCell>Member ID</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Reason</TableCell>
                  <TableCell>Payment Status</TableCell>
                  <TableCell>Payment Date</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {fines.map(f => (
                  <TableRow key={f.fine_id}>
                    <TableCell>{f.fine_id}</TableCell>
                    <TableCell>{f.member_id}</TableCell>
                    <TableCell>{f.amount}</TableCell>
                    <TableCell>{f.reason}</TableCell>
                    <TableCell>{f.payment_status}</TableCell>
                    <TableCell>{f.payment_date ? new Date(f.payment_date).toLocaleDateString() : '-'}</TableCell>
                    <TableCell>
                      <Button size="small" onClick={() => openEdit(f)}>Edit</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )
      )}

      <Dialog open={formOpen} onClose={() => handleFormClose(false)} maxWidth="md" fullWidth>
        <FineForm fine={selected} onClose={handleFormClose} />
      </Dialog>
    </Box>
  );
}
