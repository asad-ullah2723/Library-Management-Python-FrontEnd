import api from './api';

const bookService = {
  listBooks: ({ skip = 0, limit = 20 } = {}) => api.get('/books/', { params: { skip, limit } }),
  createBook: (data, isMultipart = false) => api.post('/books/', data, isMultipart ? { headers: { 'Content-Type': 'multipart/form-data' } } : {}),
  getBook: (id) => api.get(`/books/${id}`),
  updateBook: (id, data, isMultipart = false) => api.put(`/books/${id}`, data, isMultipart ? { headers: { 'Content-Type': 'multipart/form-data' } } : {}),
  deleteBook: (id) => api.delete(`/books/${id}`),
  searchBooks: ({ title, author, isbn }) => api.get('/books/search', { params: { title, author, isbn } }),
};

export default bookService;
