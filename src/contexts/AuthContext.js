import React, { createContext, useState, useContext, useEffect } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Check if user is logged in on initial load
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      fetchCurrentUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setLoading(false);
        return;
      }
      
      const response = await authApi.getCurrentUser();
      if (response.data) {
        setUser({
          id: response.data.id,
          email: response.data.email,
          name: response.data.full_name || response.data.email,
          role: response.data.role,
          is_active: response.data.is_active
        });
      }
    } catch (err) {
      console.error('Failed to fetch user:', err);
      if (err.response?.status === 401) {
        localStorage.removeItem('access_token');
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const login = async (email, password) => {
    try {
      setError('');
      const response = await authApi.login(email, password);
      
      if (response?.access_token) {
        // Store user data from the login response
        const { access_token, user_id, email: userEmail, role } = response;
        localStorage.setItem('access_token', access_token);

        // Update user state (include role)
        setUser({
          id: user_id,
          email: userEmail,
          role,
          isAuthenticated: true
        });
        
        return { success: true };
      } else {
        throw new Error('No access token received');
      }
    } catch (err) {
      console.error('Login error:', err);
      const errorMsg = err.response?.data?.detail || err.message || 'Login failed. Please check your credentials.';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      setError('');
      await authApi.register(userData);
      return { success: true };
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Registration failed. Please try again.';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await authApi.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('access_token');
      setUser(null);
    }
  };

  // Forgot password function
  const forgotPassword = async (email) => {
    try {
      setError('');
      const response = await authApi.forgotPassword(email);
      
      if (response?.data) {
        // If we get a successful response from the server
        return { success: true };
      }
      
      // If no data in response but no error, still consider it a success
      return { success: true };
      
    } catch (err) {
      console.error('Forgot password error:', err);
      
      // Handle different error response formats
      let errorMsg = 'Failed to send password reset email';
      
      if (err.response) {
        // Handle FastAPI validation errors
        if (err.response.data?.detail) {
          errorMsg = Array.isArray(err.response.data.detail) 
            ? err.response.data.detail[0]?.msg || errorMsg
            : err.response.data.detail;
        } else if (err.response.data?.message) {
          errorMsg = err.response.data.message;
        }
      }
      
      return { 
        success: false, 
        error: errorMsg 
      };
    }
  };

  // Reset password function
  const resetPassword = async (token, newPassword) => {
    try {
      await authApi.resetPassword(token, newPassword);
      return { success: true };
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Failed to reset password. Please try again.';
      return { success: false, error: errorMsg };
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
