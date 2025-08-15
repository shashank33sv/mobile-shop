// src/api.js
import axios from 'axios';

// Use deployed backend URL in production
const API_BASE = process.env.REACT_APP_API_URL 
  || (process.env.NODE_ENV === 'production' 
      ? 'https://harish-mobileshop.vercel.app/api' 
      : 'http://localhost:5000/api');

const axiosInstance = axios.create({ baseURL: API_BASE });

axiosInstance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('authToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  error => Promise.reject(error)
);

// Public product fetch for the public website (no auth required)
export const fetchPublicProducts = () => axios.get(`${API_BASE.replace('/api', '')}/api/public/products`);

// Authenticated backend API calls
export const fetchBills = () => axiosInstance.get('/bills');
export const createBill = (data) => axiosInstance.post('/bills', data);
export const updateBill = (id, data) => axiosInstance.put(`/bills/${id}`, data);
export const fetchProducts = () => axiosInstance.get('/products');
export const createProduct = (data) => axiosInstance.post('/products', data);
export const updateProduct = (id, data) => axiosInstance.put(`/products/${id}`, data);
export const deleteProduct = (id) => axiosInstance.delete(`/products/${id}`);
export const fetchServices = () => axiosInstance.get('/services');
export const createService = (data) => axiosInstance.post('/services', data);
export const updateService = (id, data) => axiosInstance.put(`/services/${id}`, data);
export const fetchInvestments = () => axiosInstance.get('/investments');
export const createInvestment = (data) => axiosInstance.post('/investments', data);
export const updateInvestment = (id, data) => axiosInstance.put(`/investments/${id}`, data);
export const fetchProfit = (type, date) => axiosInstance.get('/profits', { params: { type, date }});
export const recalculateProfits = () => axiosInstance.post('/profits/recalculate');
