import axios from 'axios';

/**
 * Central API configuration.
 * All calls go through this axios instance — one place to change the base URL.
 */
const api = axios.create({
  baseURL: 'http://localhost:8082',
  headers: { 'Content-Type': 'application/json' },
});

export default api;
