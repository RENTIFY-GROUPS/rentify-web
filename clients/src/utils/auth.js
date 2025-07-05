import API from './api';

export const register = async (userData) => {
  try {
    const response = await API.post('/auth/register', userData);
    localStorage.setItem('token', response.data.token);
    return response.data.user;
  } catch (error) {
    const message = error?.response?.data?.message || 'Registration failed';
    throw new Error(message);
  }
};

export const login = async (credentials) => {
  // Mock login for development without backend
  if (process.env.REACT_APP_USE_MOCK_LOGIN === 'true') {
    if (credentials.email === 'test@example.com' && credentials.password === 'password') {
      const mockUser = {
        id: 'mock-id',
        name: 'Test User',
        email: 'test@example.com',
        role: 'tenant'
      };
      localStorage.setItem('token', 'mock-token');
      return mockUser;
    } else {
      throw new Error('Invalid email or password');
    }
  }

  try {
    const response = await API.post('/auth/login', credentials);
    localStorage.setItem('token', response.data.token);
    return { user: response.data.user, twoFactorRequired: false };
  } catch (error) {
    if (error.response && error.response.status === 206) {
      return { twoFactorRequired: true, userId: error.response.data.userId };
    }
    const message = error?.response?.data?.message || 'Login failed';
    throw new Error(message);
  }
};

export const verify2fa = async (userId, token) => {
  try {
    const response = await API.post('/auth/login/2fa', { userId, token });
    localStorage.setItem('token', response.data.token);
    return response.data.user;
  } catch (error) {
    const message = error?.response?.data?.message || '2FA verification failed';
    throw new Error(message);
  }
};

export const logout = () => {
  localStorage.removeItem('token');
};

export const isAuthenticated = () => {
  return !!getCurrentUser();
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