import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user data if token exists
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          // Set default headers
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          const res = await api.get('/api/auth/me');
          
          if (res.data.success) {
            setUser(res.data.data);
            setIsAuthenticated(true);
          } else {
            // Token invalid
            localStorage.removeItem('token');
            delete api.defaults.headers.common['Authorization'];
            setToken(null);
            setUser(null);
            setIsAuthenticated(false);
          }
        } catch (err) {
          console.error('Error loading user:', err);
          localStorage.removeItem('token');
          delete api.defaults.headers.common['Authorization'];
          setToken(null);
          setUser(null);
          setIsAuthenticated(false);
        }
      }
      setLoading(false);
    };

    loadUser();
  }, [token]);

  // Register user
  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post('/api/auth/register', userData);
      
      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        setIsAuthenticated(true);
        
        // Set default headers
        api.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
        
        setLoading(false);
        return { success: true };
      }
    } catch (err) {
      console.error('Registration error:', err);
      setLoading(false);
      
      const errorMessage = err.response?.data?.message || 
        'Registration failed. Please try again.';
        
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Login user
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post('/api/auth/login', { email, password });
      
      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        setIsAuthenticated(true);
        
        // Set default headers
        api.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
        
        setLoading(false);
        return { success: true };
      }
    } catch (err) {
      console.error('Login error:', err);
      setLoading(false);
      
      const errorMessage = err.response?.data?.message || 
        'Login failed. Please check your credentials.';
        
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  // Check if token is expired
  const isTokenExpired = () => {
    if (!token) return true;
    
    try {
      const decoded = jwtDecode(token);
      return decoded.exp < Date.now() / 1000;
    } catch (e) {
      return true;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        loading,
        error,
        register,
        login,
        logout,
        isTokenExpired
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;