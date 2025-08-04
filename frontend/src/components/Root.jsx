import { Navigate } from 'react-router-dom';
import { authService } from '../utils/authService';
import SignIn from '../pages/Signin';

const Root = () => {
  const isAuthenticated = authService.isAuthenticated();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <SignIn />;
};

export default Root;
