import React, { useEffect, useState } from 'react';
import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, IconButton, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert } from '@mui/material';
import { Visibility, Edit, Delete } from '@mui/icons-material';
import bookService from '../../services/bookService';
import BookForm from './BookForm';
import BookDetails from './BookDetails';

export default function BookRecordsList() {
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(0);
  const [limit] = useState(20);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState({ title: '', author: '', isbn: '' });

  const [formOpen, setFormOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [toast, setToast] = useState({ open: false, severity: 'success', message: '' });

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await bookService.listBooks({ skip: page * limit, limit });
      setBooks(res.data || []);
    } catch (err) {
      console.error(err);
      setToast({ open: true, severity: 'error', message: 'Failed to load books' });
    } finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, [page]);

  const handleSearch = async () => {
    try {
      const res = await bookService.searchBooks(search);
      setBooks(res.data || []);
    } catch (err) {
      console.error(err);
      setToast({ open: true, severity: 'error', message: 'Search failed' });
    }
  };

  const openCreate = () => { setSelected(null); setFormOpen(true); };
  const openEdit = (b) => { setSelected(b); setFormOpen(true); };
  const openDetails = (b) => { setSelected(b); setDetailsOpen(true); };

  const confirmDelete = (id) => { setDeleteTarget(id); setDeleteOpen(true); };

  const handleDelete = async () => {
    setDeleteOpen(false);
    try {
      await bookService.deleteBook(deleteTarget);
      setBooks(prev => prev.filter(b => b.id !== deleteTarget));
      setToast({ open: true, severity: 'success', message: 'Book deleted' });
    } catch (err) {
      console.error(err);
      setToast({ open: true, severity: 'error', message: 'Delete failed' });
    } finally { setDeleteTarget(null); }
  };

  const handleFormClose = (refresh) => { setFormOpen(false); setSelected(null); if (refresh) fetch(); };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5">Books</Typography>
        <Button variant="contained" onClick={openCreate}>Add Book</Button>
      </Box>

      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <TextField placeholder="Title" value={search.title} onChange={e => setSearch(s => ({ ...s, title: e.target.value }))} />
        <TextField placeholder="Author" value={search.author} onChange={e => setSearch(s => ({ ...s, author: e.target.value }))} />
        <TextField placeholder="ISBN" value={search.isbn} onChange={e => setSearch(s => ({ ...s, isbn: e.target.value }))} />
        <Button onClick={handleSearch}>Search</Button>
        <Button onClick={() => { setSearch({ title: '', author: '', isbn: '' }); fetch(); }}>Clear</Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Accession / ID</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Author</TableCell>
              <TableCell>Publisher</TableCell>
              <TableCell>Edition</TableCell>
              <TableCell>ISBN</TableCell>
              <TableCell>Genre</TableCell>
              <TableCell>Language</TableCell>
              <TableCell>Pages</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Date of Purchase</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Shelf</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {books.map(b => (
              <TableRow key={b.id}>
                <TableCell>{b.accession_number} / {b.id}</TableCell>
                <TableCell>{b.title}</TableCell>
                <TableCell>{b.author}</TableCell>
                <TableCell>{b.publisher}</TableCell>
                <TableCell>{b.edition}</TableCell>
                <TableCell>{b.isbn}</TableCell>
                <TableCell>{b.genre}</TableCell>
                <TableCell>{b.language}</TableCell>
                <TableCell>{b.pages}</TableCell>
                <TableCell>{b.price}</TableCell>
                <TableCell>{b.date_of_purchase}</TableCell>
                <TableCell>{b.current_status}</TableCell>
                <TableCell>{b.shelf_number}</TableCell>
                <TableCell>
                  <IconButton onClick={() => openDetails(b)}><Visibility /></IconButton>
                  <IconButton onClick={() => openEdit(b)}><Edit /></IconButton>
                  <IconButton onClick={() => confirmDelete(b.id)}><Delete color="error" /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
        <Button disabled={page === 0} onClick={() => setPage(p => Math.max(0, p - 1))}>Previous</Button>
        <Button disabled={books.length < limit} onClick={() => setPage(p => p + 1)}>Next</Button>
      </Box>

      {formOpen && <BookForm book={selected} onClose={handleFormClose} />}
      {detailsOpen && <BookDetails book={selected} onClose={() => setDetailsOpen(false)} />}

      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogTitle>Delete book</DialogTitle>
        <DialogContent>Are you sure you want to delete this book?</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)}>Cancel</Button>
          <Button color="error" onClick={handleDelete}>Delete</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={toast.open} autoHideDuration={4000} onClose={() => setToast(t => ({ ...t, open: false }))}>
        <Alert severity={toast.severity} onClose={() => setToast(t => ({ ...t, open: false }))}>{toast.message}</Alert>
      </Snackbar>
    </Box>
  );
}
