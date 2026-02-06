import axios from 'axios';

const API_URL = process.env.VITE_API_URL;

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Public API - Track consignment
export const trackConsignment = async (trackingId) => {
  const response = await api.get(`/track/${trackingId}`);
  return response.data;
};

// Admin API - Login
export const adminLogin = async (username, password) => {
  const response = await api.post('/admin/login', { username, password });
  return response.data;
};

// Admin API - Register (initial setup)
export const adminRegister = async (username, password, email) => {
  const response = await api.post('/admin/register', { username, password, email });
  return response.data;
};

// Admin API - Get all consignments
export const getConsignments = async () => {
  const response = await api.get('/admin/consignments');
  return response.data;
};

// Admin API - Get single consignment
export const getConsignment = async (id) => {
  const response = await api.get(`/admin/consignments/${id}`);
  return response.data;
};

// Admin API - Create consignment
export const createConsignment = async (data) => {
  const response = await api.post('/admin/consignments', data);
  return response.data;
};

// Admin API - Update consignment
export const updateConsignment = async (id, data) => {
  const response = await api.put(`/admin/consignments/${id}/update`, data);
  return response.data;
};

// Admin API - Mark as delivered
export const markDelivered = async (id, note) => {
  const response = await api.put(`/admin/consignments/${id}/deliver`, { note });
  return response.data;
};

// Admin API - Delete consignment
export const deleteConsignment = async (id) => {
  const response = await api.delete(`/admin/consignments/${id}`);
  return response.data;
};

export default api;
