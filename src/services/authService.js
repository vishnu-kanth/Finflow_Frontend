import api from './api';

export const authService = {
  // POST http://localhost:9002/gateway/auth/login
  login: async ({ email, password }) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data?.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  // POST http://localhost:9002/gateway/auth/signup
  signup: async ({ name, email, password }) => {
    const response = await api.post('/auth/signup', { name, email, password });
    return response.data;
  },

  // GET http://localhost:9002/gateway/auth/me
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // POST http://localhost:9002/gateway/auth/logout
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      console.error('Logout error:', e);
    }
    localStorage.removeItem('token');
  },
};
