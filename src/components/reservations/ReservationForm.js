import React from 'react';
import { DialogTitle, DialogContent, DialogActions, TextField, Button, Grid, Box, Alert, MenuItem } from '@mui/material';
import { Formik } from 'formik';
import * as Yup from 'yup';
import reservationService from '../../services/reservationService';

const ReservationSchema = Yup.object().shape({
  reservation_id: Yup.string().required('Reservation ID is required'),
  book_id: Yup.number().integer().required('Book ID is required'),
  member_id: Yup.number().integer().required('Member ID is required'),
  reservation_date: Yup.string().matches(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD').required('Reservation date is required'),
  status: Yup.string().oneOf(['Active','Fulfilled','Cancelled']).required('Status is required'),
});

export default function ReservationForm({ reservation, onClose }) {
  const initialValues = {
    reservation_id: reservation?.reservation_id || '',
    book_id: reservation?.book_id || '',
    member_id: reservation?.member_id || '',
    reservation_date: reservation?.reservation_date || '',
    status: reservation?.status || 'Active',
  };

  return (
    <Formik initialValues={initialValues} validationSchema={ReservationSchema} enableReinitialize onSubmit={async (values, { setSubmitting, setErrors }) => {
      try {
        if (reservation && reservation.id) {
          await reservationService.updateReservation(reservation.id, values);
        } else {
          await reservationService.createReservation(values);
        }
        if (typeof onClose === 'function') onClose(true);
      } catch (err) {
        console.error(err);
        const detail = err?.response?.data?.detail;
        if (detail) {
          let msg = 'Server error: try again later';
          if (Array.isArray(detail)) {
            msg = detail.map(d => d.msg || JSON.stringify(d)).join('; ');
          } else if (typeof detail === 'object') {
            msg = detail.msg || JSON.stringify(detail);
          } else {
            msg = String(detail);
          }
          setErrors({ _error: msg });
        } else {
          setErrors({ _error: 'Server error: try again later' });
        }
      } finally { setSubmitting(false); }
    }}>
      {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
        <>
          <DialogTitle>{reservation ? 'Edit Reservation' : 'Create Reservation'}</DialogTitle>
          <DialogContent>
            {errors && errors._error && <Alert severity="error" sx={{ mb: 2 }}>{errors._error}</Alert>}
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}><TextField label="Reservation ID" name="reservation_id" value={values.reservation_id} onChange={handleChange} onBlur={handleBlur} fullWidth error={touched.reservation_id && !!errors.reservation_id} helperText={touched.reservation_id && errors.reservation_id} /></Grid>
              <Grid item xs={12} sm={6}><TextField label="Book ID" name="book_id" type="number" value={values.book_id} onChange={handleChange} onBlur={handleBlur} fullWidth error={touched.book_id && !!errors.book_id} helperText={touched.book_id && errors.book_id} /></Grid>
              <Grid item xs={12} sm={6}><TextField label="Member ID" name="member_id" type="number" value={values.member_id} onChange={handleChange} onBlur={handleBlur} fullWidth error={touched.member_id && !!errors.member_id} helperText={touched.member_id && errors.member_id} /></Grid>
              <Grid item xs={12} sm={6}><TextField label="Reservation Date" name="reservation_date" type="date" InputLabelProps={{ shrink: true }} value={values.reservation_date} onChange={handleChange} onBlur={handleBlur} fullWidth error={touched.reservation_date && !!errors.reservation_date} helperText={touched.reservation_date && errors.reservation_date} /></Grid>
              <Grid item xs={12} sm={6}><TextField select label="Status" name="status" value={values.status} onChange={handleChange} onBlur={handleBlur} fullWidth>
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Fulfilled">Fulfilled</MenuItem>
                <MenuItem value="Cancelled">Cancelled</MenuItem>
              </TextField></Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => { if (typeof onClose === 'function') onClose(false); }}>Cancel</Button>
            <Button variant="contained" onClick={handleSubmit} disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save'}</Button>
          </DialogActions>
        </>
      )}
    </Formik>
  );
}
