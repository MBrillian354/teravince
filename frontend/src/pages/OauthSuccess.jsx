import authService from '@/utils/authService';
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const OAuthSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');

    console.log(token)

    if (token) {
      authService.storeAuthData(token);

    
      navigate('/role-confirm'); 
    } else {
      navigate('/login'); 
    }
  }, [location, navigate]);

  return <p>Processing login...</p>;
};

export default OAuthSuccess;
