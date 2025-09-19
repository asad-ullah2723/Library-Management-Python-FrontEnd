import api from './api';

export const memberService = {
  listMembers: ({ skip = 0, limit = 20 } = {}) => api.get('/members/', { params: { skip, limit } }),
  createMember: (data) => api.post('/members/', data),
  getMember: (id) => api.get(`/members/${id}`),
  updateMember: (id, data) => api.put(`/members/${id}`, data),
  deleteMember: (id) => api.delete(`/members/${id}`),
};

export default memberService;
