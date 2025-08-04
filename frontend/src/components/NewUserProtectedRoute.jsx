import { Navigate, useLocation } from 'react-router-dom';
import { authService } from '../utils/authService';

const NewUserProtectedRoute = ({ children }) => {
  const location = useLocation();
  const isAuthenticated = authService.isAuthenticated();
  
  // If not authenticated, redirect to signin
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const user = authService.getStoredUser();
  
  // If on role confirmation page and user already has role, redirect to next step
  if (location.pathname === '/role-confirm' && user?.role) {
    if (!user?.jobId) {
      return <Navigate to="/job-confirm" replace />;
    } else {
      return <Navigate to="/dashboard" replace />;
    }
  }
  
  // If on job confirmation page and user doesn't have role, redirect to role confirmation
  if (location.pathname === '/job-confirm' && !user?.role) {
    return <Navigate to="/role-confirm" replace />;
  }
  
  // If on job confirmation page and user already has jobId, redirect to dashboard
  if (location.pathname === '/job-confirm' && user?.jobId) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default NewUserProtectedRoute;
