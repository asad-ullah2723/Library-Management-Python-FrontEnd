import React, { useState, useEffect } from 'react';
import { Container, Paper, Typography, Button, Box, TextField, InputAdornment } from '@mui/material';
import axios from 'axios';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import BookForm from './BookForm';
import BookSearch from './BookSearch';
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

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await api.get('/books/', {
        params: {
          skip: (page - 1) * limit,
          limit
        }
      });
      setBooks(Array.isArray(response.data) ? response.data : []);
      // If your API returns total count in headers, use that instead
      // setTotalBooks(response.headers['x-total-count'] || 0);
    } catch (err) {
      console.error('Failed to fetch books:', err);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [page]);

  useEffect(() => {
    fetchBooks();
  }, []);

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

      {/* Search Books */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom>Search Books</Typography>
        <BookSearch 
          searchTitle={searchTitle}
          setSearchTitle={setSearchTitle}
          searchAuthor={searchAuthor}
          setSearchAuthor={setSearchAuthor}
          minPrice={minPrice}
          setMinPrice={setMinPrice}
          maxPrice={maxPrice}
          setMaxPrice={setMaxPrice}
          handleSearch={handleSearch}
          fetchBooks={fetchBooks}
        />
      </Paper>

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
