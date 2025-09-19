import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Grid, Box, Alert } from '@mui/material';
import { Formik } from 'formik';
import * as Yup from 'yup';
import bookService from '../../services/bookService';

// Helpers: ISBN checksum validators (ISBN-10 and ISBN-13) and cleaning
// Helpers: ISBN checksum validators (ISBN-10 and ISBN-13) and cleaning
const cleanIsbn = (isbn = '') =>
  (isbn || '').toString().replace(/[^0-9Xx]/g, '').toUpperCase();

const isValidIsbn10 = (isbn = '') => {
  const s = cleanIsbn(isbn);
  if (s.length !== 10) return false;
  let total = 0;
  for (let i = 0; i < 10; i++) {
    const ch = s[i];
    let value;
    if (i === 9 && ch === 'X') value = 10;
    else if (/\d/.test(ch)) value = Number(ch);
    else return false;
    total += value * (10 - i);
  }
  return total % 11 === 0;
};

const isValidIsbn13 = (isbn = '') => {
  const s = cleanIsbn(isbn);
  if (s.length !== 13 || !/^\d{13}$/.test(s)) return false;
  let total = 0;
  for (let i = 0; i < 13; i++) {
    const n = Number(s[i]);
    total += (i % 2 === 0) ? n : n * 3;
  }
  return total % 10 === 0;
};

const isValidIsbn = (isbn) => {
  if (!isbn && isbn !== 0) return false;
  const s = cleanIsbn(isbn);
  if (s.length === 10) return isValidIsbn10(s);
  if (s.length === 13) return isValidIsbn13(s);
  return false;
};


const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

// Book validation schema: allow either a valid ISBN-10/13 or an 11-digit numeric accession code
const BookSchema = Yup.object().shape({
  accession_number: Yup.string().trim().max(200).optional(),
  title: Yup.string().trim().min(1, 'Title is required').max(200, 'Title too long').required('Title is required'),
  author: Yup.string().trim().min(1, 'Author is required').max(200, 'Author too long').required('Author is required'),
  publisher: Yup.string().trim().max(200).optional(),
  edition: Yup.string().trim().max(50).optional(),
  isbn: Yup.string().trim().optional().test('isbn-or-accession', 'Enter a valid ISBN-10, ISBN-13 or 11-digit accession code', function (val) {
    if (!val) return true; // optional
    const digitsOnly = (val || '').toString().replace(/[^0-9]/g, '');
    // Accept library-specific 11-digit numeric accession codes
    if (/^\d{11}$/.test(digitsOnly)) return true;
    // Otherwise validate as ISBN-10 or ISBN-13
    return isValidIsbn(val);
  }),
  genre: Yup.string().trim().max(100).optional(),
  language: Yup.string().trim().max(100).optional(),
  pages: Yup.number().integer().min(1, 'Pages must be >= 1').optional(),
  price: Yup.number().min(0, 'Price must be >= 0').optional(),
  date_of_purchase: Yup.string().trim().matches(dateRegex, 'Date must be YYYY-MM-DD').optional(),
  published_date: Yup.string().trim().matches(dateRegex, 'Date must be YYYY-MM-DD').optional(),
  current_status: Yup.string().trim().max(50).optional(),
  shelf_number: Yup.string().trim().max(100).optional(),
});

export default function BookForm({ book, onClose }) {
  const initialValues = {
    accession_number: book?.accession_number || '',
    title: book?.title || '',
    author: book?.author || '',
    publisher: book?.publisher || '',
    edition: book?.edition || '',
    isbn: book?.isbn || '',
    genre: book?.genre || '',
    language: book?.language || '',
    pages: book?.pages || '',
    price: book?.price || '',
    date_of_purchase: book?.date_of_purchase || '',
    published_date: book?.published_date || '',
    current_status: book?.current_status || 'Available',
    shelf_number: book?.shelf_number || '',
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
    <Formik initialValues={initialValues} validationSchema={BookSchema} enableReinitialize onSubmit={async (values, { setSubmitting, setErrors }) => {
      // Coerce/clean payload so backend receives proper types (numbers or omitted/null instead of empty strings)
      const payload = { ...values };
      try {
        // Numbers: pages, price
        if (payload.pages === '') delete payload.pages;
        else if (payload.pages !== undefined && payload.pages !== null) payload.pages = Number(payload.pages);

        if (payload.price === '') delete payload.price;
        else if (payload.price !== undefined && payload.price !== null) payload.price = Number(payload.price);

        // Dates: remove empty strings (backend expects null/omitted or ISO date)
        if (payload.date_of_purchase === '') delete payload.date_of_purchase;
        if (payload.published_date === '') delete payload.published_date;

        // Accession/isbn: trim, send empty as undefined
        if (payload.accession_number === '') delete payload.accession_number;
        if (payload.isbn === '') delete payload.isbn;

        if (book && book.id) {
          await bookService.updateBook(book.id, payload);
        } else {
          await bookService.createBook(payload);
        }
        // Only call onClose if a function was provided (modal usage)
        if (typeof onClose === 'function') onClose(true);
      } catch (err) {
        console.error(err);
        if (err.response && err.response.data && err.response.data.detail) {
          mapServerErrors(err.response.data.detail, setErrors);
        } else {
          setErrors({ _error: 'Server error: try again later' });
        }
      } finally { setSubmitting(false); }
    }}>
      {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => {
        const isModal = typeof onClose === 'function';
        const safeClose = (val) => { if (isModal) onClose(val); };
        const formContent = (
          <>
            {errors && errors._error && <Alert severity="error" sx={{ mb: 2 }}>{errors._error}</Alert>}
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}><TextField label="Accession Number" name="accession_number" value={values.accession_number} onChange={handleChange} onBlur={handleBlur} fullWidth /></Grid>
              <Grid item xs={12} sm={6}><TextField label="ISBN(10-13)" name="isbn" value={values.isbn} onChange={handleChange} onBlur={handleBlur} fullWidth error={touched.isbn && !!errors.isbn} helperText={touched.isbn && errors.isbn} /></Grid>
              <Grid item xs={12}><TextField label="Title" name="title" value={values.title} onChange={handleChange} onBlur={handleBlur} fullWidth error={touched.title && !!errors.title} helperText={touched.title && errors.title} /></Grid>
              <Grid item xs={12} sm={6}><TextField label="Author" name="author" value={values.author} onChange={handleChange} onBlur={handleBlur} fullWidth error={touched.author && !!errors.author} helperText={touched.author && errors.author} /></Grid>
              <Grid item xs={12} sm={6}><TextField label="Publisher" name="publisher" value={values.publisher} onChange={handleChange} onBlur={handleBlur} fullWidth /></Grid>
              <Grid item xs={12} sm={4}><TextField label="Edition" name="edition" value={values.edition} onChange={handleChange} onBlur={handleBlur} fullWidth /></Grid>
              <Grid item xs={12} sm={4}><TextField label="Genre" name="genre" value={values.genre} onChange={handleChange} onBlur={handleBlur} fullWidth /></Grid>
              <Grid item xs={12} sm={4}><TextField label="Language" name="language" value={values.language} onChange={handleChange} onBlur={handleBlur} fullWidth /></Grid>
              <Grid item xs={12} sm={4}><TextField label="Pages" name="pages" type="number" value={values.pages} onChange={handleChange} onBlur={handleBlur} fullWidth error={touched.pages && !!errors.pages} helperText={touched.pages && errors.pages} /></Grid>
              <Grid item xs={12} sm={4}><TextField label="Price" name="price" type="number" value={values.price} onChange={handleChange} onBlur={handleBlur} fullWidth error={touched.price && !!errors.price} helperText={touched.price && errors.price} /></Grid>
              <Grid item xs={12} sm={4}><TextField label="Shelf Number" name="shelf_number" value={values.shelf_number} onChange={handleChange} onBlur={handleBlur} fullWidth /></Grid>
              <Grid item xs={12} sm={6}><TextField label="Date of Purchase" name="date_of_purchase" type="date" InputLabelProps={{ shrink: true }} value={values.date_of_purchase} onChange={handleChange} onBlur={handleBlur} fullWidth error={touched.date_of_purchase && !!errors.date_of_purchase} helperText={touched.date_of_purchase && errors.date_of_purchase} /></Grid>
              <Grid item xs={12} sm={6}><TextField label="Published Date" name="published_date" type="date" InputLabelProps={{ shrink: true }} value={values.published_date} onChange={handleChange} onBlur={handleBlur} fullWidth error={touched.published_date && !!errors.published_date} helperText={touched.published_date && errors.published_date} /></Grid>
              <Grid item xs={12} sm={6}><TextField label="Current Status" name="current_status" value={values.current_status} onChange={handleChange} onBlur={handleBlur} fullWidth /></Grid>
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
              <Button onClick={() => safeClose(false)}>Cancel</Button>
              <Button variant="contained" onClick={handleSubmit} disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save'}</Button>
            </Box>
          </>
        );

        if (isModal) {
          return (
            <Dialog open onClose={() => safeClose(false)} maxWidth="md" fullWidth>
              <DialogTitle>{book ? 'Edit Book' : 'Create Book'}</DialogTitle>
              <DialogContent>
                {formContent}
              </DialogContent>
            </Dialog>
          );
        }

        // Inline (non-modal) rendering when no onClose is provided
        return (
          <Box sx={{ p: 2 }}>
            {formContent}
          </Box>
        );
      }}
    </Formik>
  );
}

