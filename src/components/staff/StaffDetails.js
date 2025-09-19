import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Grid } from '@mui/material';

export default function StaffDetails({ staff, onClose }) {
  if (!staff) return null;

  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Staff Details</DialogTitle>
      <DialogContent>
        <Grid container spacing={1} sx={{ mt: 1 }}>
          <Grid item xs={12}><Typography><strong>ID:</strong> {staff.id}</Typography></Grid>
          <Grid item xs={12}><Typography><strong>Name:</strong> {staff.name}</Typography></Grid>
          <Grid item xs={12}><Typography><strong>Role:</strong> {staff.role}</Typography></Grid>
          <Grid item xs={12}><Typography><strong>Contact:</strong> {staff.contact_info}</Typography></Grid>
          <Grid item xs={12}><Typography><strong>Shift:</strong> {staff.shift_timings}</Typography></Grid>
          <Grid item xs={12}><Typography><strong>Responsibilities:</strong> {staff.assigned_responsibilities}</Typography></Grid>
          <Grid item xs={12}><Typography><strong>Created at:</strong> {staff.created_at}</Typography></Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
