import React from 'react';
import { TextField, Button, Grid, Box } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

const BookForm = ({ newBook, setNewBook, handleAddBook }) => {
  return (
    <Box component="form" onSubmit={handleAddBook}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            label="Title"
            variant="outlined"
            value={newBook.title}
            onChange={e => setNewBook({ ...newBook, title: e.target.value })}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            label="Author"
            variant="outlined"
            value={newBook.author}
            onChange={e => setNewBook({ ...newBook, author: e.target.value })}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            label="ISBN"
            variant="outlined"
            value={newBook.isbn}
            onChange={e => setNewBook({ ...newBook, isbn: e.target.value })}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            type="number"
            label="Price ($)"
            variant="outlined"
            value={newBook.price}
            onChange={e => setNewBook({ ...newBook, price: e.target.value })}
            inputProps={{ step: '0.01', min: '0' }}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            type="date"
            label="Published Date"
            variant="outlined"
            value={newBook.published_date}
            onChange={e => setNewBook({ ...newBook, published_date: e.target.value })}
            InputLabelProps={{
              shrink: true,
            }}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            startIcon={<AddIcon />}
            size="large"
          >
            Add Book
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BookForm;
