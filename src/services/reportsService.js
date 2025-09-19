import api from './api';

const reportsService = {
  getDailyActivity: (days = 30) => api.get('/reports/daily-activity', { params: { days } }),
  getMonthlyActivity: (months = 6) => api.get('/reports/monthly-activity', { params: { months } }),
  getMostBorrowed: (limit = 10) => api.get('/reports/most-borrowed', { params: { limit } }),
  getInactiveMembers: (months = 6) => api.get('/reports/inactive-members', { params: { months } }),
  getFineCollection: (days = 30) => api.get('/reports/fine-collection', { params: { days } }),
  getAuthLogs: (skip = 0, limit = 100) => api.get('/auth/logs', { params: { skip, limit } }),
};

export default reportsService;
