import React from 'react';
import { DialogTitle, DialogContent, DialogActions, TextField, Button, Grid, Box, Alert, MenuItem } from '@mui/material';
import { Formik } from 'formik';
import * as Yup from 'yup';
import fineService from '../../services/fineService';

const FineSchema = Yup.object().shape({
  fine_id: Yup.string().required('Fine ID is required'),
  member_id: Yup.number().integer().required('Member is required'),
  amount: Yup.number().moreThan(0, 'Amount must be greater than 0').required('Amount is required'),
  reason: Yup.string().oneOf(['Overdue','Lost','Damaged']).required('Reason is required'),
  payment_status: Yup.string().oneOf(['Paid','Unpaid']).required('Payment status is required'),
  payment_date: Yup.string().nullable().matches(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD').nullable(),
});

export default function FineForm({ fine, onClose }) {
  const initialValues = {
    fine_id: fine?.fine_id || '',
    member_id: fine?.member_id || '',
    amount: fine?.amount || '',
    reason: fine?.reason || 'Overdue',
    payment_status: fine?.payment_status || 'Unpaid',
    payment_date: fine?.payment_date || '',
  };

  const normalizeDetail = (detail) => {
    if (!detail) return 'Server error';
    if (Array.isArray(detail)) return detail.map(d => d.msg || JSON.stringify(d)).join('; ');
    if (typeof detail === 'object') return detail.msg || JSON.stringify(detail);
    return String(detail);
  };

  return (
    <Formik initialValues={initialValues} validationSchema={FineSchema} enableReinitialize onSubmit={async (values, { setSubmitting, setErrors }) => {
      try {
        if (fine && fine.id) await fineService.updateFine(fine.id, values);
        else await fineService.createFine(values);
        if (typeof onClose === 'function') onClose(true);
      } catch (err) {
        console.error(err);
        const detail = err?.response?.data?.detail;
        setErrors({ _error: normalizeDetail(detail) });
      } finally { setSubmitting(false); }
    }}>
      {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
        <>
          <DialogTitle>{fine ? 'Edit Fine' : 'Create Fine'}</DialogTitle>
          <DialogContent>
            {errors && errors._error && <Alert severity="error" sx={{ mb: 2 }}>{errors._error}</Alert>}
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}><TextField label="Fine ID" name="fine_id" value={values.fine_id} onChange={handleChange} onBlur={handleBlur} fullWidth error={touched.fine_id && !!errors.fine_id} helperText={touched.fine_id && errors.fine_id} /></Grid>
              <Grid item xs={12} sm={6}><TextField label="Member ID" name="member_id" type="number" value={values.member_id} onChange={handleChange} onBlur={handleBlur} fullWidth error={touched.member_id && !!errors.member_id} helperText={touched.member_id && errors.member_id} /></Grid>
              <Grid item xs={12} sm={6}><TextField label="Amount" name="amount" type="number" value={values.amount} onChange={handleChange} onBlur={handleBlur} fullWidth error={touched.amount && !!errors.amount} helperText={touched.amount && errors.amount} /></Grid>
              <Grid item xs={12} sm={6}><TextField select label="Reason" name="reason" value={values.reason} onChange={handleChange} onBlur={handleBlur} fullWidth>
                <MenuItem value="Overdue">Overdue</MenuItem>
                <MenuItem value="Lost">Lost</MenuItem>
                <MenuItem value="Damaged">Damaged</MenuItem>
              </TextField></Grid>
              <Grid item xs={12} sm={6}><TextField select label="Payment Status" name="payment_status" value={values.payment_status} onChange={handleChange} onBlur={handleBlur} fullWidth>
                <MenuItem value="Paid">Paid</MenuItem>
                <MenuItem value="Unpaid">Unpaid</MenuItem>
              </TextField></Grid>
              <Grid item xs={12} sm={6}><TextField label="Payment Date" name="payment_date" type="date" InputLabelProps={{ shrink: true }} value={values.payment_date} onChange={handleChange} onBlur={handleBlur} fullWidth error={touched.payment_date && !!errors.payment_date} helperText={touched.payment_date && errors.payment_date} /></Grid>
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
