import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true, // JWT cookie යැවීමට අත්‍යවශ්‍යයි
});

export default api;