import API from './api';

export const register = async (userData) => {
  try {
    const response = await API.post('/auth/register', userData);
    localStorage.setItem('token', response.data.token);
    return response.data.user;
  } catch (error) {
    throw error.response.data.message || 'Registration failed';
  }
};

export const login = async (credentials) => {
  try {
    const response = await API.post('/auth/login', credentials);
    localStorage.setItem('token', response.data.token);
    return response.data.user;
  } catch (error) {
    throw error.response.data.message || 'Login failed';
  }
};

export const logout = () => {
  localStorage.removeItem('token');
};

export const getCurrentUser = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  
  try {
    // In a real app, you might want to verify the token with the server
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(window.atob(base64));
    
    return {
      id: payload.id,
      name: payload.name,
      email: payload.email,
      role: payload.role
    };
  } catch (error) {
    return null;
  }
};