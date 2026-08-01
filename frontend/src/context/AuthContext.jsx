import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('devreview_token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get('/auth/profile');
        if (res.data.success) {
          setUser(res.data.user);
        } else {
          // Token is invalid, clear storage
          localStorage.removeItem('devreview_token');
        }
      } catch (err) {
        console.error('Error verifying token on mount:', err);
        localStorage.removeItem('devreview_token');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        localStorage.setItem('devreview_token', res.data.token);
        setUser(res.data.user);
        return res.data;
      } else {
        throw new Error(res.data.message || 'Login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const register = async (username, email, password) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/register', { username, email, password });
      if (res.data.success) {
        localStorage.setItem('devreview_token', res.data.token);
        setUser(res.data.user);
        return res.data;
      } else {
        throw new Error(res.data.message || 'Registration failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('devreview_token');
    setUser(null);
  };

  const updateProfile = async (username, email, password) => {
    setLoading(true);
    try {
      const res = await api.put('/auth/profile', { username, email, password });
      if (res.data.success) {
        setUser(res.data.user);
        if (res.data.token) {
          localStorage.setItem('devreview_token', res.data.token);
        }
        return res.data;
      } else {
        throw new Error(res.data.message || 'Profile update failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
