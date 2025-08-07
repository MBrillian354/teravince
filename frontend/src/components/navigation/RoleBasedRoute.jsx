import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { authService } from '../../utils/authService';

// Component that automatically routes users based on their role
const RoleBasedRoute = ({ children, allowedRoles = [] }) => {
  const location = useLocation();
  const isAuthenticated = authService.isAuthenticated();
  const user = authService.getStoredUser();

  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // If allowedRoles is specified, check if user has permission
  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role?.toLowerCase())) {
    // Redirect to dashboard regardless of role
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Component that shows different content based on user role
export const RoleBasedContent = ({ adminContent, supervisorContent, staffContent }) => {
  const user = authService.getStoredUser();
  const role = user?.role?.toLowerCase();

  switch (role) {
    case 'admin':
      return adminContent || null;
    case 'supervisor':
      return supervisorContent || null;
    case 'staff':
      return staffContent || null;
    default:
      return null;
  }
};

export default RoleBasedRoute;
