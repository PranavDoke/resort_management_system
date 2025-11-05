import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Guests API
export const guestsAPI = {
  getAll: (params) => api.get('/guests', { params }),
  getById: (id) => api.get(`/guests/${id}`),
  create: (data) => api.post('/guests', data),
  update: (id, data) => api.put(`/guests/${id}`, data),
  delete: (id) => api.delete(`/guests/${id}`),
};

// Rooms API
export const roomsAPI = {
  getAll: (params) => api.get('/rooms', { params }),
  getById: (id) => api.get(`/rooms/${id}`),
  create: (data) => api.post('/rooms', data),
  update: (id, data) => api.put(`/rooms/${id}`, data),
  delete: (id) => api.delete(`/rooms/${id}`),
  bulkUpdateStatus: (data) => api.post('/rooms/bulk-update-status', data),
};

// Bookings API
export const bookingsAPI = {
  getAll: (params) => api.get('/bookings', { params }),
  getDetailed: (params) => api.get('/bookings/detailed', { params }),
  getById: (id) => api.get(`/bookings/${id}`),
  create: (data) => api.post('/bookings', data),
  bulkCreate: (data) => api.post('/bookings/bulk', data),
  update: (id, data) => api.put(`/bookings/${id}`, data),
  delete: (id) => api.delete(`/bookings/${id}`),
  checkClash: (data) => api.post('/bookings/check-clash', data),
};

// Amenities API
export const amenitiesAPI = {
  getAll: (params) => api.get('/amenities', { params }),
  getById: (id) => api.get(`/amenities/${id}`),
  create: (data) => api.post('/amenities', data),
  update: (id, data) => api.put(`/amenities/${id}`, data),
  delete: (id) => api.delete(`/amenities/${id}`),
};

// Services API
export const servicesAPI = {
  getAll: (params) => api.get('/services', { params }),
  getDetailed: (params) => api.get('/services/detailed', { params }),
  getById: (id) => api.get(`/services/${id}`),
  create: (data) => api.post('/services', data),
  update: (id, data) => api.put(`/services/${id}`, data),
  delete: (id) => api.delete(`/services/${id}`),
};

// Staff API
export const staffAPI = {
  getAll: (params) => api.get('/staff', { params }),
  getById: (id) => api.get(`/staff/${id}`),
  create: (data) => api.post('/staff', data),
  update: (id, data) => api.put(`/staff/${id}`, data),
  delete: (id) => api.delete(`/staff/${id}`),
};

// Reports API
export const reportsAPI = {
  getOccupancy: (params) => api.get('/reports/occupancy', { params }),
  getRevenue: (params) => api.get('/reports/revenue', { params }),
  getGuestsByRoomType: (params) => api.get('/reports/guests-by-roomtype', { params }),
  getTopAmenities: (params) => api.get('/reports/top-amenities', { params }),
  getServicesSummary: (params) => api.get('/reports/services-summary', { params }),
  getDashboard: () => api.get('/reports/dashboard'),
};

export default api;
