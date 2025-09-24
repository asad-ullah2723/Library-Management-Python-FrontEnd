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
  const [totalBooks, setTotalBooks] = useState(0);
  const limit = 10; // Number of books per page
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
        setBooks(combined);
      } else {
        const response = await publicApi.get('/books/', {
          params: {
            skip: (page - 1) * limit,
            limit
          }
        });
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

  // React to page changes or header search query param changes
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('search') || '';
    if (q) {
      // reflect in the simple title/author inputs to keep UI consistent
      setSearchTitle(q);
      setSearchAuthor(q);
      fetchBooks(q);
    } else {
      // clear any previous quick-search values
      setSearchTitle('');
      setSearchAuthor('');
      fetchBooks();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, location.search]);

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
    <Container maxWidth="lg" sx={{ py: 4 }}>
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
        <Box>
          <Button 
            variant="outlined" 
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            sx={{ mr: 1 }}
          >
            Previous
          </Button>
          <Button 
            variant="outlined"
            onClick={() => setPage(p => p + 1)}
            disabled={books.length < limit}
          >
            Next
          </Button>
        </Box>
      </Box>
      
      <BookList 
        books={books}
        handleDelete={handleDelete}
        canModify={canModify}
      />
      
      {books.length === 0 && !loading && (
        <Typography variant="body1" color="textSecondary" sx={{ mt: 2, textAlign: 'center' }}>
          No books found. {page > 1 ? 'Go back to previous pages.' : 'Add a new book to get started!'}
        </Typography>
      )}
    </Container>
  );
};

export default LibraryApp;
