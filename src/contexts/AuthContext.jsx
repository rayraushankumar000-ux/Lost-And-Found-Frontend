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
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await authAPI.getProfile();
      
      if (!response.data || !response.data.success) {
        throw new Error('Invalid response');
      }

      // Update user data from server
      const userData = response.data.data;
      if (!userData) {
        throw new Error('No user data');
      }

      const cleanUserData = {
        id: userData._id || userData.id,
        name: userData.name,
        email: userData.email,
        role: userData.role || 'user',
        verified: userData.verified || false,
        phone: userData.phone,
        avatar: userData.avatar
      };
      
      setUser(cleanUserData);
      localStorage.setItem('user', JSON.stringify(cleanUserData));
    } catch (error) {
      console.error('❌ Auth check failed:', error);
      logout();
    }
  };

  const login = async (credentials) => {
    try {
      console.log('🔐 Attempting login...', { email: credentials.email });
      
      // Validate credentials
      if (!credentials.email || !credentials.password) {
        return { success: false, error: 'Please provide email and password' };
      }

      const response = await authAPI.login(credentials);
      
      // Log full response for debugging
      console.log('📥 Login response:', response.data);
      
      // Backend returns { success: true, data: { _id, name, email, token, ... } }
      if (!response || !response.data) {
        console.error('❌ No response data:', response);
        throw new Error('No response from server');
      }

      if (!response.data.success) {
        throw new Error(response.data?.message || 'Login failed');
      }

      const userData = response.data.data;
      
      if (!userData) {
        console.error('❌ No user data in response:', response.data);
        throw new Error('No user data received');
      }

      if (!userData.token) {
        console.error('❌ No token in response:', response.data);
        throw new Error('No authentication token received');
      }

      const cleanUserData = {
        id: userData._id || userData.id,
        name: userData.name,
        email: userData.email,
        role: userData.role || 'user',
        verified: userData.verified || false,
        phone: userData.phone,
        avatar: userData.avatar
      };
      
      // Store user and token
      setUser(cleanUserData);
      localStorage.setItem('user', JSON.stringify(cleanUserData));
      localStorage.setItem('token', userData.token);
      
      console.log('✅ Login successful:', cleanUserData.email);
      return { success: true, user: cleanUserData };
    } catch (error) {
      console.error('❌ Login error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      let message = 'Login failed';
      if (error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error.message) {
        message = error.message;
      }
      
      return { success: false, error: message };
    }
  };

  const register = async (userData) => {
    try {
      console.log('📝 Attempting registration...', { email: userData.email });
      const response = await authAPI.register(userData);
      
      // Backend returns { success: true, data: { _id, name, email, token, ... } }
      if (!response.data || !response.data.success) {
        throw new Error(response.data?.message || 'Registration failed');
      }

      const newUser = response.data.data; 
      
      if (!newUser || !newUser.token) {
        console.error('❌ No token in response:', response.data);
        throw new Error('Invalid response from server');
      }

      const cleanUserData = {
        id: newUser._id || newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role || 'user',
        verified: newUser.verified || false,
        phone: newUser.phone
      };
      
      // Store user and token
      setUser(cleanUserData);
      localStorage.setItem('user', JSON.stringify(cleanUserData));
      localStorage.setItem('token', newUser.token);
      
      console.log('✅ Registration successful:', cleanUserData.email);
      return { success: true, user: cleanUserData };
    } catch (error) {
      console.error('❌ Registration error:', error);
      const message = error.response?.data?.message || error.message || 'Registration failed';
      return { success: false, error: message };
    }
  };

  const signup = register; // Alias for signup endpoint

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
    signup, // Alias for register
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