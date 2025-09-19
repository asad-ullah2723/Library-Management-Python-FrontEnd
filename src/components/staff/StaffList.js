import React, { useEffect, useState } from 'react';
import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert } from '@mui/material';
import { Visibility, Edit, Delete } from '@mui/icons-material';
import staffService from '../../services/staffService';
import StaffForm from './StaffForm';
import StaffDetails from './StaffDetails';

export default function StaffList() {
  const [staff, setStaff] = useState([]);
  const [page, setPage] = useState(0);
  const [limit] = useState(20);
  const [loading, setLoading] = useState(false);

  const [formOpen, setFormOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [toast, setToast] = useState({ open: false, severity: 'success', message: '' });

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await staffService.listStaff({ skip: page * limit, limit });
      setStaff(res.data || []);
    } catch (err) {
      console.error(err);
      setToast({ open: true, severity: 'error', message: 'Failed to load staff' });
    } finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, [page]);

  const openCreate = () => { setSelected(null); setFormOpen(true); };
  const openEdit = (s) => { setSelected(s); setFormOpen(true); };
  const openDetails = (s) => { setSelected(s); setDetailsOpen(true); };

  const confirmDelete = (id) => { setDeleteTarget(id); setDeleteOpen(true); };

  const handleDelete = async () => {
    setDeleteOpen(false);
    try {
      await staffService.deleteStaff(deleteTarget);
      setStaff(prev => prev.filter(s => s.id !== deleteTarget));
      setToast({ open: true, severity: 'success', message: 'Staff deleted' });
    } catch (err) {
      console.error(err);
      setToast({ open: true, severity: 'error', message: 'Delete failed' });
    } finally { setDeleteTarget(null); }
  };

  const handleFormClose = (refresh) => { setFormOpen(false); setSelected(null); if (refresh) fetch(); };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5">Staff</Typography>
        <Button variant="contained" onClick={openCreate}>Add Staff</Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Contact Info</TableCell>
              <TableCell>Shift Timings</TableCell>
              <TableCell>Responsibilities</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {staff.map(s => (
              <TableRow key={s.id}>
                <TableCell>{s.id}</TableCell>
                <TableCell>{s.name}</TableCell>
                <TableCell>{s.role}</TableCell>
                <TableCell>{s.contact_info}</TableCell>
                <TableCell>{s.shift_timings}</TableCell>
                <TableCell>{s.assigned_responsibilities}</TableCell>
                <TableCell>
                  <IconButton onClick={() => openDetails(s)}><Visibility /></IconButton>
                  <IconButton onClick={() => openEdit(s)}><Edit /></IconButton>
                  <IconButton onClick={() => confirmDelete(s.id)}><Delete color="error" /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
        <Button disabled={page === 0} onClick={() => setPage(p => Math.max(0, p - 1))}>Previous</Button>
        <Button disabled={staff.length < limit} onClick={() => setPage(p => p + 1)}>Next</Button>
      </Box>

      {formOpen && <StaffForm staff={selected} onClose={handleFormClose} />}
      {detailsOpen && <StaffDetails staff={selected} onClose={() => setDetailsOpen(false)} />}

      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogTitle>Delete staff</DialogTitle>
        <DialogContent>Are you sure you want to delete this staff member?</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)}>Cancel</Button>
          <Button color="error" onClick={handleDelete}>Delete</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={toast.open} autoHideDuration={4000} onClose={() => setToast(t => ({ ...t, open: false }))}>
        <Alert severity={toast.severity} onClose={() => setToast(t => ({ ...t, open: false }))}>{toast.message}</Alert>
      </Snackbar>
    </Box>
  );
}
