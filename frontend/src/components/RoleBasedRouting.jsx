import { Navigate, useLocation } from 'react-router-dom';
import { canAccessRoute } from '../utils/routeConfig';

const RoleBasedRouting = ({ children }) => {
  const location = useLocation();
  const { canAccess, redirectTo } = canAccessRoute(location.pathname);

  if (!canAccess && redirectTo) {
    return <Navigate to={redirectTo} replace state={{ from: location }} />;
  }

  return children;
};

export default RoleBasedRouting;
