import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button, MenuItem, Alert } from '@mui/material';
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
  const [message, setMessage] = useState(null);
  const [severity, setSeverity] = useState('info');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const resp = await adminService.createUser(form);
      setLoading(false);
      // show success message, but keep modal open so admin can see the result
      setMessage(resp.data?.message || 'User created successfully');
      setSeverity('success');
      onCreated && onCreated(resp.data);
    } catch (err) {
      setLoading(false);
      console.error('Create user failed', err);
      // try various shapes for backend error message
      const errMsg = err?.response?.data?.detail || err?.response?.data?.message || err?.message || 'Failed to create user';
      setMessage(errMsg);
      setSeverity('error');
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
        {message && (
          <Alert severity={severity} sx={{ mb: 2 }}>{message}</Alert>
        )}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={onClose} sx={{ mr: 1 }}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={loading}>{loading ? 'Creating...' : 'Create'}</Button>
        </Box>
      </Box>
    </Modal>
  );
}
