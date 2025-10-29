import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (savedUser && token) {
      try {
        setUser(JSON.parse(savedUser));
        // Verify token is still valid
        checkAuth();
      } catch (error) {
        console.error('Error parsing saved user:', error);
        logout();
      }
    }
    setLoading(false);
  }, []);

  const checkAuth = async () => {
    try {
      await authAPI.getProfile();
    } catch (error) {
      logout();
    }
  };

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      const userData = response.data;
      
      const cleanUserData = {
        id: userData._id,
        name: userData.name,
        email: userData.email,
        role: userData.role || 'user',
        verified: userData.verified || false,
        phone: userData.phone,
        avatar: userData.avatar
      };
      
      setUser(cleanUserData);
      localStorage.setItem('user', JSON.stringify(cleanUserData));
      localStorage.setItem('token', userData.token);
      
      return { success: true, user: cleanUserData };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      return { success: false, error: message };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      const newUser = response.data;
      
      const cleanUserData = {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role || 'user',
        verified: newUser.verified || false,
        phone: newUser.phone
      };
      
      setUser(cleanUserData);
      localStorage.setItem('user', JSON.stringify(cleanUserData));
      localStorage.setItem('token', newUser.token);
      
      return { success: true, user: cleanUserData };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      return { success: false, error: message };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const updateUser = (updatedData) => {
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    login,
    register,
    logout,
    updateUser,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};