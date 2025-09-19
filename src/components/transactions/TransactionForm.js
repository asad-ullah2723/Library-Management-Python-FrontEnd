import React from 'react';
import { DialogTitle, DialogContent, DialogActions, TextField, Button, Grid, Box, Alert } from '@mui/material';
import { Formik } from 'formik';
import * as Yup from 'yup';
import transactionService from '../transactions/TransactionList';

const TransactionSchema = Yup.object().shape({
  transaction_id: Yup.string().required('Transaction ID is required'),
  member_id: Yup.number().integer().required('Member ID is required'),
  book_id: Yup.number().integer().required('Book ID is required'),
  issue_date: Yup.string().matches(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD').required('Issue date is required'),
  due_date: Yup.string().matches(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD').required('Due date is required'),
  return_date: Yup.string().nullable().matches(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD').optional(),
  fine_details: Yup.string().nullable().optional(),
  renewal_count: Yup.number().integer().min(0).required('Renewal count is required'),
});

export default function TransactionForm({ transaction, onClose }) {
  const initialValues = {
    transaction_id: transaction?.transaction_id || '',
    member_id: transaction?.member_id || '',
    book_id: transaction?.book_id || '',
    issue_date: transaction?.issue_date || '',
    due_date: transaction?.due_date || '',
    return_date: transaction?.return_date || '',
    fine_details: transaction?.fine_details || '',
    renewal_count: transaction?.renewal_count ?? 0,
  };

  return (
    <Formik initialValues={initialValues} validationSchema={TransactionSchema} enableReinitialize onSubmit={async (values, { setSubmitting, setErrors }) => {
      try {
        if (transaction && transaction.id) {
          await transactionService.updateTransaction(transaction.id, values);
        } else {
          await transactionService.createTransaction(values);
        }
        if (typeof onClose === 'function') onClose(true);
      } catch (err) {
        console.error(err);
        if (err.response && err.response.data && err.response.data.detail) {
          setErrors({ _error: err.response.data.detail });
        } else {
          setErrors({ _error: 'Server error: try again later' });
        }
      } finally { setSubmitting(false); }
    }}>
      {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
        <>
          <DialogTitle>{transaction ? 'Edit Transaction' : 'Create Transaction'}</DialogTitle>
          <DialogContent>
            {errors && errors._error && <Alert severity="error" sx={{ mb: 2 }}>{errors._error}</Alert>}
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}><TextField label="Transaction ID" name="transaction_id" value={values.transaction_id} onChange={handleChange} onBlur={handleBlur} fullWidth error={touched.transaction_id && !!errors.transaction_id} helperText={touched.transaction_id && errors.transaction_id} /></Grid>
              <Grid item xs={12} sm={6}><TextField label="Member ID" name="member_id" type="number" value={values.member_id} onChange={handleChange} onBlur={handleBlur} fullWidth error={touched.member_id && !!errors.member_id} helperText={touched.member_id && errors.member_id} /></Grid>
              <Grid item xs={12} sm={6}><TextField label="Book ID" name="book_id" type="number" value={values.book_id} onChange={handleChange} onBlur={handleBlur} fullWidth error={touched.book_id && !!errors.book_id} helperText={touched.book_id && errors.book_id} /></Grid>
              <Grid item xs={12} sm={6}><TextField label="Issue Date" name="issue_date" type="date" InputLabelProps={{ shrink: true }} value={values.issue_date} onChange={handleChange} onBlur={handleBlur} fullWidth error={touched.issue_date && !!errors.issue_date} helperText={touched.issue_date && errors.issue_date} /></Grid>
              <Grid item xs={12} sm={6}><TextField label="Due Date" name="due_date" type="date" InputLabelProps={{ shrink: true }} value={values.due_date} onChange={handleChange} onBlur={handleBlur} fullWidth error={touched.due_date && !!errors.due_date} helperText={touched.due_date && errors.due_date} /></Grid>
              <Grid item xs={12} sm={6}><TextField label="Return Date" name="return_date" type="date" InputLabelProps={{ shrink: true }} value={values.return_date} onChange={handleChange} onBlur={handleBlur} fullWidth error={touched.return_date && !!errors.return_date} helperText={touched.return_date && errors.return_date} /></Grid>
              <Grid item xs={12}><TextField label="Fine Details" name="fine_details" value={values.fine_details} onChange={handleChange} onBlur={handleBlur} fullWidth /></Grid>
              <Grid item xs={12} sm={4}><TextField label="Renewal Count" name="renewal_count" type="number" value={values.renewal_count} onChange={handleChange} onBlur={handleBlur} fullWidth error={touched.renewal_count && !!errors.renewal_count} helperText={touched.renewal_count && errors.renewal_count} /></Grid>
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
