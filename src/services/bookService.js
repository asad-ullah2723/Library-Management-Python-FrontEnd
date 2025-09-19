import api from './api';

const bookService = {
  listBooks: ({ skip = 0, limit = 20 } = {}) => api.get('/books/', { params: { skip, limit } }),
  createBook: (data) => api.post('/books/', data),
  getBook: (id) => api.get(`/books/${id}`),
  updateBook: (id, data) => api.put(`/books/${id}`, data),
  deleteBook: (id) => api.delete(`/books/${id}`),
  searchBooks: ({ title, author, isbn }) => api.get('/books/search', { params: { title, author, isbn } }),
};

export default bookService;
