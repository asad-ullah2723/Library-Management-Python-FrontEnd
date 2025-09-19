import api from './api';

const reservationService = {
  listReservations: ({ skip = 0, limit = 20 } = {}) => api.get('/reservations/', { params: { skip, limit } }),
  createReservation: (data) => api.post('/reservations/', data),
  getReservation: (id) => api.get(`/reservations/${id}`),
  updateReservation: (id, data) => api.put(`/reservations/${id}`, data),
  deleteReservation: (id) => api.delete(`/reservations/${id}`),
  searchReservations: (params) => api.get('/reservations/search', { params }),
};

export default reservationService;
