import React from 'react';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ProtectedRoute = ({ children, requiredRole }) => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const token = localStorage.getItem('authToken');

  if (!token || !user) {
    toast.error('Please login to access this page');
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && !requiredRole.includes(user.role)) {
    toast.error('You do not have permission to access this page');
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;