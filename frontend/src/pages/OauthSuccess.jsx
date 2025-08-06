import authService from '@/utils/authService';
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const OAuthSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');
    const encodedUserData = queryParams.get('user');

    console.log('Token:', token);
    console.log('Encoded User Data:', encodedUserData);

    if (token) {
      let userData = null;
      
      // Decode user data if it exists
      if (encodedUserData) {
        try {
          userData = JSON.parse(atob(encodedUserData)); // Decode base64
          console.log('Decoded User Data:', userData);
        } catch (error) {
          console.error('Failed to decode user data:', error);
        }
      }

      // Store both token and user data
      authService.storeAuthData(token, userData);

      navigate('/role-confirm'); 
    } else {
      navigate('/login'); 
    }
  }, [location, navigate]);

  return <p>Processing login...</p>;
};

export default OAuthSuccess;
