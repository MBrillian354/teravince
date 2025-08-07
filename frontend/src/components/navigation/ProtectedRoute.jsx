import { Navigate, useLocation } from 'react-router-dom';
import { authService } from '../../utils/authService';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const location = useLocation();
  const isAuthenticated = authService.isAuthenticated();
  const user = authService.getStoredUser();

  if (!isAuthenticated) {
    // Redirect to signin with the current location as state
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // If a specific role is required, check if user has that role
  if (requiredRole && user && user.role !== requiredRole) {
    // Redirect to unified dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
