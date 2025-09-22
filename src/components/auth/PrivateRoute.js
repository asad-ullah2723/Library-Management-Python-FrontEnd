import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const PrivateRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Or a loading spinner
  }

  // If not authenticated, send visitor to public home instead of forcing the login page
  return user ? <Outlet /> : <Navigate to="/" replace />;
};

export default PrivateRoute;
