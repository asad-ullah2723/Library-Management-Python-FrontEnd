import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

function decodeRoleFromToken() {
  try {
    const token = localStorage.getItem('access_token') || localStorage.getItem('token');
    if (!token) return null;
    const b64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(b64));
    return payload?.role || (payload?.data && payload.data.role) || null;
  } catch (e) {
    return null;
  }
}

const isAdminUser = (user) => {
  if (!user) return false;
  if (typeof user.role === 'string' && user.role.toLowerCase() === 'admin') return true;
  if (user.is_admin === true) return true;
  if (Array.isArray(user.roles) && user.roles.includes('admin')) return true;
  const tokenRole = decodeRoleFromToken();
  if (typeof tokenRole === 'string' && tokenRole.toLowerCase() === 'admin') return true;
  return false;
};

const AdminRoute = () => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user) return <Navigate to="/login" replace />;

  if (!isAdminUser(user)) return <Navigate to="/" replace />;

  return <Outlet />;
};

export default AdminRoute;
