import api from './api';

export const userService = {
  // Get current user info
  getCurrentUser: async () => {
    const response = await api.get('/users/me/');
    return response.data;
  },
};