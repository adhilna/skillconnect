import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext' // Adjust import path as needed

const RequireAuth = ({ children, allowedRoles }) => {
  const { authState } = AuthContext();
  const location = useLocation();

  // If user not logged in, redirect to login
  if (!authState?.user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If user role not in allowedRoles, redirect to unauthorized
  if (allowedRoles && !allowedRoles.includes(authState.user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // If checks pass, render the protected content
  return children;
};

export default RequireAuth;
