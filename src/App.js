import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Grid, 
  Card, 
  CardContent, 
  CardActions, 
  IconButton,
  AppBar,
  Toolbar,
  Box,
  CssBaseline,
  createTheme,
  ThemeProvider
} from '@mui/material';
import { Delete as DeleteIcon, Search as SearchIcon, Add as AddIcon, Refresh as RefreshIcon } from '@mui/icons-material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
  },
});

const useStyles = {
  root: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    padding: theme => theme.spacing(3),
  },
  header: {
    marginBottom: theme => theme.spacing(4),
  },
  section: {
    marginBottom: theme => theme.spacing(4),
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.2s, box-shadow 0.2s',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
    },
  },
  form: {
    '& .MuiTextField-root': {
      marginBottom: theme => theme.spacing(2),
    },
  },
  searchForm: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '16px',
    marginBottom: theme => theme.spacing(3),
    '& > *': {
      flex: '1 1 200px',
    },
  },
  bookCard: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  bookContent: {
    flexGrow: 1,
  },
  priceTag: {
    fontWeight: 'bold',
    color: theme => theme.palette.primary.main,
    margin: '8px 0',
  },
  actionArea: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 16px',
  },
};

const App = () => {
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


  const fetchBooks = async () => {
    try {
      const res = await axios.get(`http://localhost:9000/books/search`);
      setBooks(res.data);
    } catch (err) {
      console.error('Failed to fetch books');
    }
  };

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
      const res = await axios.post('http://localhost:9000/books', bookData);
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
      await axios.delete(`http://localhost:9000/books/${id}`);
      setBooks(books.filter(book => book.id !== id));
    } catch (err) {
      alert('Failed to delete book');
    }
  };

  // Search books
  const handleSearch = async () => {
    try {
      const res = await axios.get(`http://localhost:9000/books/search`, {
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

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            📚 Library Management System
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={useStyles.root}>
        {/* Add Book Form */}
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" gutterBottom>Add New Book</Typography>
          <Box component="form" onSubmit={handleAddBook} sx={useStyles.form}>
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
        </Paper>

        {/* Search Form */}
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" gutterBottom>Search Books</Typography>
          <Box sx={useStyles.searchForm}>
            <TextField
              label="Title"
              variant="outlined"
              value={searchTitle}
              onChange={e => setSearchTitle(e.target.value)}
              fullWidth
            />
            <TextField
              label="Author"
              variant="outlined"
              value={searchAuthor}
              onChange={e => setSearchAuthor(e.target.value)}
              fullWidth
            />
            <TextField
              type="number"
              label="Min Price"
              variant="outlined"
              value={minPrice}
              onChange={e => setMinPrice(e.target.value)}
              inputProps={{ step: '0.01', min: '0' }}
              fullWidth
            />
            <TextField
              type="number"
              label="Max Price"
              variant="outlined"
              value={maxPrice}
              onChange={e => setMaxPrice(e.target.value)}
              inputProps={{ step: '0.01', min: '0' }}
              fullWidth
            />
          </Box>
          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleSearch}
              startIcon={<SearchIcon />}
            >
              Search
            </Button>
            <Button 
              variant="outlined" 
              color="primary" 
              onClick={fetchBooks}
              startIcon={<RefreshIcon />}
            >
              Reset
            </Button>
          </Box>
        </Paper>

        {/* Book List */}
        <Typography variant="h5" gutterBottom>Book Collection</Typography>
        {books.length === 0 ? (
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body1">No books found. Add a new book to get started!</Typography>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {books.map(book => (
              <Grid item key={book.id} xs={12} sm={6} md={4} lg={3}>
                <Card sx={useStyles.card}>
                  <CardContent sx={useStyles.bookContent}>
                    <Typography gutterBottom variant="h6" component="div" noWrap>
                      {book.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      by {book.author}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      ISBN: {book.isbn}
                    </Typography>
                    <Typography variant="h6" sx={useStyles.priceTag}>
                      ${parseFloat(book.price).toFixed(2)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Published: {new Date(book.published_date).toLocaleDateString()}
                    </Typography>
                  </CardContent>
                  <CardActions sx={useStyles.actionArea}>
                    <IconButton 
                      color="error" 
                      onClick={() => handleDelete(book.id)}
                      aria-label="delete"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </ThemeProvider>
  );
};

export default App;
