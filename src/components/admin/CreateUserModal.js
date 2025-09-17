import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button, MenuItem } from '@mui/material';
import adminService from '../../services/adminService';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

const roles = ['member', 'librarian', 'admin'];

export default function CreateUserModal({ open, onClose, onCreated }) {
  const [form, setForm] = useState({ email: '', full_name: '', password: '', role: 'member', is_active: true });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const resp = await adminService.createUser(form);
      setLoading(false);
      onCreated && onCreated(resp.data);
      onClose();
    } catch (err) {
      setLoading(false);
      console.error('Create user failed', err);
      alert('Failed to create user');
    }
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="create-user-modal">
      <Box sx={style} component="form" onSubmit={handleSubmit}>
        <Typography id="create-user-modal" variant="h6" component="h2" gutterBottom>
          Create User
        </Typography>
        <TextField fullWidth label="Email" name="email" value={form.email} onChange={handleChange} sx={{ mb: 2 }} />
        <TextField fullWidth label="Full name" name="full_name" value={form.full_name} onChange={handleChange} sx={{ mb: 2 }} />
        <TextField fullWidth label="Password" name="password" type="password" value={form.password} onChange={handleChange} sx={{ mb: 2 }} />
        <TextField select fullWidth label="Role" name="role" value={form.role} onChange={handleChange} sx={{ mb: 2 }}>
          {roles.map(r => <MenuItem key={r} value={r}>{r}</MenuItem>)}
        </TextField>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={onClose} sx={{ mr: 1 }}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={loading}>{loading ? 'Creating...' : 'Create'}</Button>
        </Box>
      </Box>
    </Modal>
  );
}
