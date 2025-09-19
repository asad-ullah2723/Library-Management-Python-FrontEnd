import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Grid } from '@mui/material';

export default function MemberDetails({ member, onClose }) {
  if (!member) return null;

  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Member Details</DialogTitle>
      <DialogContent>
        <Grid container spacing={1} sx={{ mt: 1 }}>
          <Grid item xs={12}><Typography><strong>ID:</strong> {member.id}</Typography></Grid>
          <Grid item xs={12}><Typography><strong>Name:</strong> {member.full_name}</Typography></Grid>
          <Grid item xs={12}><Typography><strong>Email:</strong> {member.email}</Typography></Grid>
          <Grid item xs={12}><Typography><strong>Contact:</strong> {member.contact_number}</Typography></Grid>
          <Grid item xs={12}><Typography><strong>Membership:</strong> {member.membership_type}</Typography></Grid>
          <Grid item xs={12}><Typography><strong>Start:</strong> {member.start_date}</Typography></Grid>
          <Grid item xs={12}><Typography><strong>Expiry:</strong> {member.expiry_date}</Typography></Grid>
          <Grid item xs={12}><Typography><strong>Fine dues:</strong> {member.fine_dues}</Typography></Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
