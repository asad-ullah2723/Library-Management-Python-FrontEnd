import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, Typography, Box } from '@mui/material';
import { publicApi } from '../../services/api';

export default function BookDetails({ book, onClose }) {
  if (!book) return null;
  const resolveImageUrl = (url) => {
    if (!url) return null;
    if (/^https?:\/\//i.test(url)) return url;
    const base = publicApi && publicApi.defaults && publicApi.defaults.baseURL ? publicApi.defaults.baseURL : '';
    return `${base.replace(/\/$/, '')}/${url.replace(/^\//, '')}`;
  };
  return (
    <Dialog open onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Book Details</DialogTitle>
      <DialogContent>
        {book.image_url ? (
          <Box sx={{ width: '100%', height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2, bgcolor: 'grey.100' }}>
            <Box component="img" src={resolveImageUrl(book.image_url)} alt={book.title} sx={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
          </Box>
        ) : (
          <Typography color="text.secondary" sx={{ mb: 2 }}>No cover image available</Typography>
        )}
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
