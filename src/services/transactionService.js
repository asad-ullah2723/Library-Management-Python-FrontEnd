import api from './api';

const transactionService = {
  listTransactions: ({ skip = 0, limit = 20 } = {}) => api.get('/transactions/', { params: { skip, limit } }),
  createTransaction: (data) => api.post('/transactions/', data),
  getTransaction: (id) => api.get(`/transactions/${id}`),
  updateTransaction: (id, data) => api.put(`/transactions/${id}`, data),
  deleteTransaction: (id) => api.delete(`/transactions/${id}`),
  searchTransactions: (params) => api.get('/transactions/search', { params }),
};

export default transactionService;
