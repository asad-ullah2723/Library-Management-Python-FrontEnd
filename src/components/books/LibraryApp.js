import React, { useState, useEffect } from 'react';
import { Container, Paper, Typography, Button, Box, TextField, InputAdornment } from '@mui/material';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import api, { publicApi } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import BookForm from './BookForm';
import BookList from './BookList';

const LibraryApp = () => {
  const [books, setBooks] = useState([]);
  const [searchTitle, setSearchTitle] = useState('');
  const [searchAuthor, setSearchAuthor] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [newBook, setNewBook] = useState({ 
    title: '', 
    author: '', 
    isbn: '', 
    price: '',
    published_date: ''
  });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const limit = 20; // items per page for pagination
  const { user } = useAuth();
  const canModify = user?.role === 'admin' || user?.role === 'librarian';
  const location = useLocation();

  // Fetch books: if q is provided, call the search endpoint (title/author), otherwise call listing
  const fetchBooks = async (q) => {
    try {
      setLoading(true);
  if (q) {
        // Perform title OR author search by calling both endpoints and merging results
        const [byTitle, byAuthor] = await Promise.all([
          publicApi.get('/books/search', { params: { title: q, skip: 0, limit: 100 } }).catch(() => ({ data: [] })),
          publicApi.get('/books/search', { params: { author: q, skip: 0, limit: 100 } }).catch(() => ({ data: [] })),
        ]);
        const combined = [];
        const seen = new Set();
        const addList = (arr) => {
          (Array.isArray(arr) ? arr : []).forEach((b) => {
            const id = b?.id ?? (b?.isbn || JSON.stringify(b));
            if (!seen.has(id)) {
              seen.add(id);
              combined.push(b);
            }
          });
        };
        addList(byTitle.data);
        addList(byAuthor.data);
        console.debug('Books search combined result:', combined);
        setBooks(combined);
      } else {
        // Fetch books for the current page using skip/limit
        const response = await publicApi.get('/books/', { params: { skip: (page - 1) * limit, limit } });
        console.debug('Books page response.data (len):', Array.isArray(response.data) ? response.data.length : 'N/A', response.data);
        console.debug('Books page response.headers:', response.headers);
        setBooks(Array.isArray(response.data) ? response.data : []);
      }
      // If your API returns total count in headers, use that instead
      // setTotalBooks(response.headers['x-total-count'] || 0);
    } catch (err) {
      console.error('Failed to fetch books:', err);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  // React to header search query param changes
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('search') || '';
    if (q) {
      // reflect in the simple title/author inputs to keep UI consistent
      setSearchTitle(q);
      setSearchAuthor(q);
      // when searching, reset to first page of results and fetch without pagination
      setPage(1);
      fetchBooks(q);
    } else {
      // clear any previous quick-search values
      setSearchTitle('');
      setSearchAuthor('');
      fetchBooks();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search, page]);

  // Add new book
  const handleAddBook = async (e) => {
    e.preventDefault();
    try {
      const bookData = {
        ...newBook,
        price: parseFloat(newBook.price)  // Ensure price is a number
      };
  const res = await api.post('/books/', bookData);
      setBooks([...books, res.data]);
      setNewBook({ 
        title: '', 
        author: '', 
        isbn: '', 
        price: '',
        published_date: ''
      });
    } catch (err) {
      console.error('Error adding book:', err);
      alert('Failed to add book. Please check the console for details.');
    }
  };

  // Delete a book
  const handleDelete = async (id) => {
    try {
  await api.delete(`/books/${id}`);
      setBooks(books.filter(book => book.id !== id));
    } catch (err) {
      alert('Failed to delete book');
    }
  };

  // Search books
  const handleSearch = async () => {
    try {
      const res = await api.get(`/books/search`, {
        params: {
          title: searchTitle || undefined,
          author: searchAuthor || undefined,
          min_price: minPrice || undefined,
          max_price: maxPrice || undefined,
        },
      });
      setBooks(res.data);
    } catch (err) {
      alert('Search failed');
    }
  };

  if (loading && books.length === 0) {
    return <div>Loading books...</div>;
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4, px: { xs: 2, sm: 3, md: 6 }, maxWidth: 1200, marginX: 'auto' }}>
      {/* Add Book Form */}
      {canModify && (
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" gutterBottom>Add New Book</Typography>
          <BookForm 
            newBook={newBook}
            setNewBook={setNewBook}
            handleAddBook={handleAddBook}
          />
        </Paper>
      )}

      {/* Search Books: header search used for title/author, in-page advanced search removed */}

      {/* Book List with Pagination */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">Book Collection</Typography>
        {/* Pagination controls (hidden while searching) */}
        {!(searchTitle || searchAuthor) && (
          <Box>
            <Button variant="outlined" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} sx={{ mr: 1 }}>
              Previous
            </Button>
            <Button variant="outlined" onClick={() => setPage(p => p + 1)} disabled={books.length < limit}>
              Next
            </Button>
          </Box>
        )}
      </Box>
      
      <BookList 
        books={books}
        handleDelete={handleDelete}
        canModify={canModify}
      />
      
      {books.length === 0 && !loading && (
        <Typography variant="body1" color="textSecondary" sx={{ mt: 2, textAlign: 'center' }}>
          No books found. Add a new book to get started!
        </Typography>
      )}
    </Container>
  );
};

export default LibraryApp;
