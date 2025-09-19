import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, Typography } from '@mui/material';

export default function BookDetails({ book, onClose }) {
  if (!book) return null;
  return (
    <Dialog open onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Book Details</DialogTitle>
      <DialogContent>
        <Grid container spacing={1} sx={{ mt: 1 }}>
          <Grid item xs={12}><Typography><strong>Accession / ID:</strong> {book.accession_number} / {book.id}</Typography></Grid>
          <Grid item xs={12}><Typography><strong>Title:</strong> {book.title}</Typography></Grid>
          <Grid item xs={12}><Typography><strong>Author:</strong> {book.author}</Typography></Grid>
          <Grid item xs={12}><Typography><strong>Publisher:</strong> {book.publisher}</Typography></Grid>
          <Grid item xs={12}><Typography><strong>Edition:</strong> {book.edition}</Typography></Grid>
          <Grid item xs={12}><Typography><strong>ISBN:</strong> {book.isbn}</Typography></Grid>
          <Grid item xs={12}><Typography><strong>Genre:</strong> {book.genre}</Typography></Grid>
          <Grid item xs={12}><Typography><strong>Language:</strong> {book.language}</Typography></Grid>
          <Grid item xs={12}><Typography><strong>Pages:</strong> {book.pages}</Typography></Grid>
          <Grid item xs={12}><Typography><strong>Price:</strong> {book.price}</Typography></Grid>
          <Grid item xs={12}><Typography><strong>Date of Purchase:</strong> {book.date_of_purchase}</Typography></Grid>
          <Grid item xs={12}><Typography><strong>Published Date:</strong> {book.published_date}</Typography></Grid>
          <Grid item xs={12}><Typography><strong>Status:</strong> {book.current_status}</Typography></Grid>
          <Grid item xs={12}><Typography><strong>Shelf:</strong> {book.shelf_number}</Typography></Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
