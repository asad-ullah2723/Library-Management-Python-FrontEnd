import React, { useEffect, useState } from 'react';
import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Visibility, Edit, Delete } from '@mui/icons-material';
import memberService from '../../services/memberService';
import MemberForm from './MemberForm';
import MemberDetails from './MemberDetails';

export default function MembersList() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [limit] = useState(10);
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await memberService.listMembers({ skip: page * limit, limit });
      setMembers(res.data || []);
    } catch (err) {
      console.error('Failed to load members', err);
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, [page]);

  const handleCreate = () => { setSelected(null); setShowForm(true); };
  const handleEdit = (m) => { setSelected(m); setShowForm(true); };
  const handleView = (m) => { setSelected(m); setShowDetails(true); };

  const confirmDelete = (id) => { setDeleteTarget(id); setDeleteDialogOpen(true); };

  const handleDeleteConfirmed = async () => {
    const id = deleteTarget;
    setDeleteDialogOpen(false);
    setDeleteTarget(null);
    try {
      await memberService.deleteMember(id);
      setMembers(prev => prev.filter(m => m.id !== id));
      console.log('Member deleted', id);
    } catch (err) {
      console.error('Failed to delete member', err);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5">Members</Typography>
        <Button variant="contained" onClick={handleCreate}>Add Member</Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Full Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Membership</TableCell>
              <TableCell>Start</TableCell>
              <TableCell>Expiry</TableCell>
              <TableCell>Fine</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {members.map(m => (
              <TableRow key={m.id}>
                <TableCell>{m.id}</TableCell>
                <TableCell>{m.full_name}</TableCell>
                <TableCell>{m.email}</TableCell>
                <TableCell>{m.contact_number}</TableCell>
                <TableCell>{m.membership_type}</TableCell>
                <TableCell>{m.start_date}</TableCell>
                <TableCell>{m.expiry_date}</TableCell>
                <TableCell>{m.fine_dues}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleView(m)}><Visibility /></IconButton>
                  <IconButton onClick={() => handleEdit(m)}><Edit /></IconButton>
                  <IconButton onClick={() => confirmDelete(m.id)}><Delete color="error" /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
        <Button disabled={page === 0} onClick={() => setPage(p => Math.max(0, p - 1))}>Previous</Button>
        <Button disabled={members.length < limit} onClick={() => setPage(p => p + 1)}>Next</Button>
      </Box>

      {showForm && (
        <MemberForm
          member={selected}
          onClose={() => { setShowForm(false); fetch(); }}
        />
      )}

      {showDetails && (
        <MemberDetails member={selected} onClose={() => setShowDetails(false)} />
      )}

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete member</DialogTitle>
        <DialogContent>Are you sure you want to delete this member?</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button color="error" onClick={handleDeleteConfirmed}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
