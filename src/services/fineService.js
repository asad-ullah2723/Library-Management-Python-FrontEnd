import api from './api';

const fineService = {
  listFines: ({ skip = 0, limit = 20 } = {}) => api.get('/fines/', { params: { skip, limit } }),
  createFine: (data) => api.post('/fines/', data),
  getFine: (id) => api.get(`/fines/${id}`),
  updateFine: (id, data) => api.put(`/fines/${id}`, data),
  deleteFine: (id) => api.delete(`/fines/${id}`),
  searchFines: (params) => api.get('/fines/search', { params }),
};

export default fineService;
