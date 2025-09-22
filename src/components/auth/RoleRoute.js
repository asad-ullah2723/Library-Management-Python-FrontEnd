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

const roleMatches = (user, allowedRoles = []) => {
  if (!user) return false;
  const normalizedAllowed = allowedRoles.map(r => String(r).toLowerCase());

  // check normalized role string
  if (typeof user.role === 'string' && normalizedAllowed.includes(user.role.toLowerCase())) return true;

  // check boolean flags
  if (user.is_admin === true && normalizedAllowed.includes('admin')) return true;
  if (user.is_librarian === true && normalizedAllowed.includes('librarian')) return true;

  // check roles array
  if (Array.isArray(user.roles)) {
    for (const r of user.roles) {
      if (normalizedAllowed.includes(String(r).toLowerCase())) return true;
    }
  }

  // token fallback
  const tokenRole = decodeRoleFromToken();
  if (tokenRole && normalizedAllowed.includes(String(tokenRole).toLowerCase())) return true;

  return false;
};

const RoleRoute = ({ allowedRoles = [] }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user) return <Navigate to="/login" replace />;

  if (!roleMatches(user, allowedRoles)) return <Navigate to="/" replace />;

  return <Outlet />;
};

export default RoleRoute;
