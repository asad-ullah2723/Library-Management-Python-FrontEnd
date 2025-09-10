import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:9000',
  withCredentials: true,  // Important for sending cookies
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle 401 responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Remove token and redirect to login
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  register: (userData) => api.post('/auth/register', userData),
  
  login: async (email, password) => {
    const response = await api.post('/auth/login', {
      email,
      password
    }, {
      withCredentials: true
    });
    
    // Save the token to localStorage
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
    }
    
    return response.data;
  },
  
  getCurrentUser: () => api.get('/auth/me'),
  
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  
  resetPassword: (token, newPassword) => 
    api.post('/auth/reset-password', { token, new_password: newPassword }),
  
  logout: () => api.post('/auth/logout')
};

// Books API
export const booksApi = {
  getAllBooks: () => api.get('/books'),
  searchBooks: (params) => api.get('/books/search', { params }),
  addBook: (bookData) => api.post('/books', bookData),
  deleteBook: (id) => api.delete(`/books/${id}`)
};

export default api;
