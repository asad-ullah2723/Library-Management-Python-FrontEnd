import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [books, setBooks] = useState([]);
  const [searchTitle, setSearchTitle] = useState('');
  const [searchAuthor, setSearchAuthor] = useState('');
  const [newBook, setNewBook] = useState({ title: '', author: '' });

  // Fetch all books initially
  const fetchBooks = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/books/search`);
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
      const res = await axios.post('http://localhost:8000/books', newBook);
      setBooks([...books, res.data]);
      setNewBook({ title: '', author: '' });
    } catch (err) {
      alert('Failed to add book');
    }
  };

  // Delete a book
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/books/${id}`);
      setBooks(books.filter(book => book.id !== id));
    } catch (err) {
      alert('Failed to delete book');
    }
  };

  // Search books
  const handleSearch = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/books/search`, {
        params: {
          title: searchTitle || undefined,
          author: searchAuthor || undefined,
        },
      });
      setBooks(res.data);
    } catch (err) {
      alert('Search failed');
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h2>📚 Library Management</h2>

      {/* Add Book Form */}
      <form onSubmit={handleAddBook} style={{ marginBottom: '1rem' }}>
        <h3>Add a Book</h3>
        <input
          type="text"
          placeholder="Title"
          value={newBook.title}
          onChange={e => setNewBook({ ...newBook, title: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Author"
          value={newBook.author}
          onChange={e => setNewBook({ ...newBook, author: e.target.value })}
          required
        />
        <button type="submit">Add</button>
      </form>

      {/* Search Form */}
      <div style={{ marginBottom: '1rem' }}>
        <h3>Search Books</h3>
        <input
          type="text"
          placeholder="Search by title"
          value={searchTitle}
          onChange={e => setSearchTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Search by author"
          value={searchAuthor}
          onChange={e => setSearchAuthor(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
        <button onClick={fetchBooks} style={{ marginLeft: '0.5rem' }}>Reset</button>
      </div>

      {/* Book List */}
      <h3>Book List</h3>
      {books.length === 0 ? (
        <p>No books available.</p>
      ) : (
        <ul>
          {books.map(book => (
            <li key={book.id}>
              <strong>{book.title}</strong> by {book.author}
              <button
                style={{ marginLeft: '1rem', color: 'red' }}
                onClick={() => handleDelete(book.id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default App;
