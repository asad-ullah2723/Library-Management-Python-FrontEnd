import React, { useEffect, useState } from 'react';
import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Dialog } from '@mui/material';
import reservationService from '../../services/reservationService';
import ReservationForm from './ReservationForm';

export default function ReservationList() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [limit] = useState(20);
  const [formOpen, setFormOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await reservationService.listReservations({ skip: page * limit, limit });
      setReservations(res.data || []);
    } catch (err) {
      console.error('Failed to load reservations', err);
      setReservations([]);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, [page]);

  const openCreate = () => { setSelected(null); setFormOpen(true); };
  const openEdit = (r) => { setSelected(r); setFormOpen(true); };

  const handleFormClose = (refresh) => { setFormOpen(false); setSelected(null); if (refresh) fetch(); };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5">Reservations</Typography>
        <Button variant="contained" onClick={openCreate}>Add Reservation</Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Reservation ID</TableCell>
              <TableCell>Book ID</TableCell>
              <TableCell>Member ID</TableCell>
              <TableCell>Reservation Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reservations.map(r => (
              <TableRow key={r.id}>
                <TableCell>{r.reservation_id}</TableCell>
                <TableCell>{r.book_id}</TableCell>
                <TableCell>{r.member_id}</TableCell>
                <TableCell>{r.reservation_date}</TableCell>
                <TableCell>{r.status}</TableCell>
                <TableCell>
                  <Button size="small" onClick={() => openEdit(r)}>Edit</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={formOpen} onClose={() => handleFormClose(false)} maxWidth="md" fullWidth>
        <ReservationForm reservation={selected} onClose={handleFormClose} />
      </Dialog>
    </Box>
  );
}
