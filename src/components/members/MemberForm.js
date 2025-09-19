import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Grid, FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';
import memberService from '../../services/memberService';

const membershipOptions = ['Student', 'Teacher', 'Staff', 'Public'];

function isValidEmail(email) {
  // simple email regex
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
}

export default function MemberForm({ member, onClose }) {
  const [form, setForm] = useState({ full_name: '', email: '', contact_number: '', membership_type: '', start_date: '', expiry_date: '', fine_dues: 0 });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (member) setForm(prev => ({ ...prev, ...member })); }, [member]);

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.full_name || form.full_name.trim().length < 2) e.full_name = 'Enter full name';
    if (!form.email || !isValidEmail(form.email)) e.email = 'Enter a valid email';
    if (!form.contact_number || form.contact_number.trim().length < 6) e.contact_number = 'Enter contact number';
    if (!form.membership_type || !membershipOptions.includes(form.membership_type)) e.membership_type = 'Select membership type';
    // dates should be YYYY-MM-DD; basic ISO check
    if (form.start_date && !/^\d{4}-\d{2}-\d{2}$/.test(form.start_date)) e.start_date = 'Date must be YYYY-MM-DD';
    if (form.expiry_date && !/^\d{4}-\d{2}-\d{2}$/.test(form.expiry_date)) e.expiry_date = 'Date must be YYYY-MM-DD';
    if (form.fine_dues === '' || form.fine_dues === null || isNaN(Number(form.fine_dues))) e.fine_dues = 'Fine dues must be a number';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const payload = { ...form };
      // ensure numeric fine_dues
      payload.fine_dues = Number(payload.fine_dues || 0);

      if (member && member.id) {
        await memberService.updateMember(member.id, payload);
        // consider using snackbar; keeping console for now
        console.log('Member updated');
      } else {
        await memberService.createMember(payload);
        console.log('Member created');
      }
      onClose();
    } catch (err) {
      console.error(err);
    } finally { setSaving(false); }
  };

  const disableSave = saving;

  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{member ? 'Edit Member' : 'Create Member'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              label="Full name"
              value={form.full_name}
              onChange={e => set('full_name', e.target.value)}
              fullWidth
              error={!!errors.full_name}
              helperText={errors.full_name}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Email"
              value={form.email}
              onChange={e => set('email', e.target.value)}
              fullWidth
              error={!!errors.email}
              helperText={errors.email}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Contact"
              value={form.contact_number}
              onChange={e => set('contact_number', e.target.value)}
              fullWidth
              error={!!errors.contact_number}
              helperText={errors.contact_number}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={!!errors.membership_type}>
              <InputLabel id="membership-label">Membership Type</InputLabel>
              <Select
                labelId="membership-label"
                value={form.membership_type}
                label="Membership Type"
                onChange={e => set('membership_type', e.target.value)}
              >
                {membershipOptions.map(opt => (
                  <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                ))}
              </Select>
              {errors.membership_type && <FormHelperText>{errors.membership_type}</FormHelperText>}
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Fine Dues"
              type="number"
              value={form.fine_dues}
              onChange={e => set('fine_dues', e.target.value)}
              fullWidth
              error={!!errors.fine_dues}
              helperText={errors.fine_dues}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Start Date"
              type="date"
              value={form.start_date}
              onChange={e => set('start_date', e.target.value)}
              fullWidth
              InputLabelProps={{ shrink: true }}
              error={!!errors.start_date}
              helperText={errors.start_date}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Expiry Date"
              type="date"
              value={form.expiry_date}
              onChange={e => set('expiry_date', e.target.value)}
              fullWidth
              InputLabelProps={{ shrink: true }}
              error={!!errors.expiry_date}
              helperText={errors.expiry_date}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Address"
              value={form.address || ''}
              onChange={e => set('address', e.target.value)}
              fullWidth
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave} disabled={disableSave}>{saving ? 'Saving...' : 'Save'}</Button>
      </DialogActions>
    </Dialog>
  );
}
