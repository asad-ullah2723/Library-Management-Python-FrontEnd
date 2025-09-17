import api from './api';

// Admin service for Users and Books
export const adminService = {
  // Users
  listUsers: ({ skip = 0, limit = 20, search } = {}) => {
    const params = { skip, limit };
    if (search) params.search = search;
    return api.get('/admin/users/', { params });
  },

  createUser: (userData) => api.post('/admin/users/', userData),

  getUser: (userId) => api.get(`/admin/users/${userId}`),

  updateUser: (userId, patchData) => api.patch(`/admin/users/${userId}`, patchData),

  deleteUser: (userId) => api.delete(`/admin/users/${userId}`),

  // Books
  listBooks: ({ skip = 0, limit = 20, title, author, status } = {}) => {
    const params = { skip, limit };
    if (title) params.title = title;
    if (author) params.author = author;
    if (status) params.status = status;
    return api.get('/admin/books/', { params });
  },

  createBook: (bookData) => api.post('/admin/books/', bookData),

  getBook: (bookId) => api.get(`/admin/books/${bookId}`),

  updateBook: (bookId, patchData) => api.patch(`/admin/books/${bookId}`, patchData),

  deleteBook: (bookId) => api.delete(`/admin/books/${bookId}`),
};

export default adminService;
