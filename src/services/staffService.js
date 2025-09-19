import api from './api';

const staffService = {
  listStaff: ({ skip = 0, limit = 20 } = {}) => api.get('/staff/', { params: { skip, limit } }),
  createStaff: (data) => api.post('/staff/', data),
  getStaff: (id) => api.get(`/staff/${id}`),
  updateStaff: (id, data) => api.put(`/staff/${id}`, data),
  deleteStaff: (id) => api.delete(`/staff/${id}`),
};

export default staffService;
