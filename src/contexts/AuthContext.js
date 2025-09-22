import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
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
      // schedule token expiry cleanup if present
      scheduleTokenExpiry(token);
    } else {
      setLoading(false);
    }
  }, []);

  const expiryTimerRef = useRef(null);

  const parseJwt = (token) => {
    try {
      const b64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      const json = decodeURIComponent(atob(b64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(json);
    } catch (e) {
      return null;
    }
  };

  const clearExpiryTimer = () => {
    if (expiryTimerRef.current) {
      clearTimeout(expiryTimerRef.current);
      expiryTimerRef.current = null;
    }
  };

  const handleTokenExpired = () => {
    try {
      localStorage.removeItem('access_token');
      localStorage.removeItem('token');
    } catch (e) {
      // ignore
    }
    clearExpiryTimer();
    setUser(null);
  };

  const scheduleTokenExpiry = (token) => {
    try {
      clearExpiryTimer();
      const payload = parseJwt(token);
      if (!payload || !payload.exp) return;
      const expiresAt = payload.exp * 1000; // ms
      const now = Date.now();
      const delay = Math.max(0, expiresAt - now);
      if (delay === 0) {
        // already expired
        handleTokenExpired();
        return;
      }
      // Schedule a cleanup slightly after expiry (add 1s cushion)
      expiryTimerRef.current = setTimeout(() => {
        handleTokenExpired();
      }, delay + 1000);
    } catch (e) {
      // ignore
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setLoading(false);
        return;
      }
      
      const response = await authApi.getCurrentUser();
      if (response.data) {
        // Normalize role from possible shapes
        const srv = response.data;
        let role = srv.role;
        if (!role && Array.isArray(srv.roles) && srv.roles.length) role = srv.roles[0];
        if (!role && typeof srv.is_admin === 'boolean') role = srv.is_admin ? 'admin' : 'user';
        // If still no role, try decode token claim
        if (!role) {
          try {
            const token = localStorage.getItem('access_token') || localStorage.getItem('token');
            if (token) {
              const b64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
              const payload = JSON.parse(atob(b64));
              role = payload?.role || (payload?.data && payload.data.role) || role;
            }
          } catch (e) {
            // ignore
          }
        }

        setUser({
          id: srv.id,
          email: srv.email,
          name: srv.full_name || srv.email,
          role,
          is_active: srv.is_active
        });
      }
    } catch (err) {
      console.error('Failed to fetch user:', err);
      if (err.response?.status === 401) {
        // token invalid/expired on server - clean locally
        handleTokenExpired();
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
        // Store token
        const { access_token } = response;
        localStorage.setItem('access_token', access_token);
        // Schedule automatic removal when token expires
        scheduleTokenExpiry(access_token);

        // Refresh current user from server to get canonical role & profile
        await fetchCurrentUser();
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
      try {
        localStorage.removeItem('access_token');
        localStorage.removeItem('token');
      } catch (e) {}
      clearExpiryTimer();
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
    getToken: () => localStorage.getItem('access_token') || localStorage.getItem('token'),
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
