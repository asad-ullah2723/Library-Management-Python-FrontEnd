import React, { useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Grid } from '@mui/material';
import { Formik } from 'formik';
import * as Yup from 'yup';
import staffService from '../../services/staffService';

const shiftRegex = /^([01]\d|2[0-3]):[0-5]\d-([01]\d|2[0-3]):[0-5]\d$/;

const StaffSchema = Yup.object().shape({
  name: Yup.string().trim().min(1, 'Name is required').max(200, 'Name is too long').required('Name is required'),
  role: Yup.string().trim().max(100, 'Role is too long').optional(),
  contact_info: Yup.string().trim().test('is-email-or-phone', 'Must be a valid email or phone', value => { if (!value) return true; const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; const phoneRegex = /^[0-9()+\-\s]+$/; return emailRegex.test(value) || phoneRegex.test(value); }).optional(),
  shift_timings: Yup.string().trim().test('shift-format', 'Shift must be HH:MM-HH:MM', value => { if (!value) return true; return shiftRegex.test(value); }).optional(),
  assigned_responsibilities: Yup.string().trim().max(2000).optional(),
});

export default function StaffForm({ staff, onClose }) {
  useEffect(() => {}, [staff]);

  const initialValues = {
    name: staff?.name || '',
    role: staff?.role || '',
    contact_info: staff?.contact_info || '',
    shift_timings: staff?.shift_timings || '',
    assigned_responsibilities: staff?.assigned_responsibilities || '',
  };

  const mapServerErrors = (detailArray, setErrors) => {
    if (!Array.isArray(detailArray)) return;
    const errs = {};
    detailArray.forEach(item => {
      if (item && item.loc) {
        const key = item.loc[item.loc.length - 1];
        errs[key] = item.msg || JSON.stringify(item);
      }
    });
    setErrors(errs);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={StaffSchema}
      enableReinitialize
      onSubmit={async (values, { setSubmitting, setErrors }) => {
        try {
          if (staff && staff.id) {
            await staffService.updateStaff(staff.id, values);
          } else {
            await staffService.createStaff(values);
          }
          onClose(true);
        } catch (err) {
          console.error(err);
          if (err.response && err.response.data && err.response.data.detail) {
            mapServerErrors(err.response.data.detail, setErrors);
          } else {
            setErrors({ _error: 'Server error: try again later' });
          }
        } finally { setSubmitting(false); }
      }}>
      {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
        <Dialog open onClose={() => onClose(false)} maxWidth="sm" fullWidth>
          <DialogTitle>{staff ? 'Edit Staff' : 'Create Staff'}</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  label="Name"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  fullWidth
                  error={touched.name && !!errors.name}
                  helperText={touched.name && errors.name}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Role" name="role" value={values.role} onChange={handleChange} onBlur={handleBlur} fullWidth error={touched.role && !!errors.role} helperText={touched.role && errors.role} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Contact Info" name="contact_info" value={values.contact_info} onChange={handleChange} onBlur={handleBlur} fullWidth error={touched.contact_info && !!errors.contact_info} helperText={touched.contact_info && errors.contact_info} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Shift Timings" name="shift_timings" placeholder="09:00-17:00" value={values.shift_timings} onChange={handleChange} onBlur={handleBlur} fullWidth error={touched.shift_timings && !!errors.shift_timings} helperText={touched.shift_timings && errors.shift_timings} />
              </Grid>
              <Grid item xs={12}>
                <TextField label="Assigned Responsibilities" name="assigned_responsibilities" value={values.assigned_responsibilities} onChange={handleChange} onBlur={handleBlur} fullWidth multiline rows={3} error={touched.assigned_responsibilities && !!errors.assigned_responsibilities} helperText={touched.assigned_responsibilities && errors.assigned_responsibilities} />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => onClose(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleSubmit} disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save'}</Button>
          </DialogActions>
        </Dialog>
      )}
    </Formik>
  );
}
