import { Navigate } from 'react-router-dom';
import { authService } from '../utils/authService';
import SignIn from '../pages/auth/Signin';

const Root = () => {
  const isAuthenticated = authService.isAuthenticated();

  if (isAuthenticated) {
    const user = authService.getStoredUser();
    
    // Check if user needs role confirmation
    if (!user?.role) {
      return <Navigate to="/role-confirm" replace />;
    }
    
    // Check if user needs job confirmation
    if (!user?.jobId) {
      return <Navigate to="/job-confirm" replace />;
    }
    
    // User has both role and jobId, redirect to dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return <SignIn />;
};

export default Root;
