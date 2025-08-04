import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import DynamicForm from '../components/DynamicForm';
import { useModal } from '../hooks/useModal';
import { selectModal } from '../store/modalSlice';
import { authService } from '../utils/authService';
import googleLogo from '../assets/logos/google.png';

function Signin() {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isWaitingForRedirect, setIsWaitingForRedirect] = useState(false);
  const navigate = useNavigate();
  const modal = useModal();
  const modalState = useSelector(selectModal);
  const redirectTimeoutRef = useRef(null);

  // Clean up timeout on component unmount
  useEffect(() => {
    return () => {
      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current);
      }
    };
  }, []);

  // Watch for modal closing while waiting for redirect
  useEffect(() => {
    if (isWaitingForRedirect && !modalState.isOpen) {
      // Modal was closed manually, redirect immediately
      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current);
        redirectTimeoutRef.current = null;
      }
      setIsWaitingForRedirect(false);
      redirectToAppropriateRoute();
    }
  }, [modalState.isOpen, isWaitingForRedirect, navigate]);

  // Function to redirect user based on their role
  const redirectToAppropriateRoute = (user = null) => {
    const storedUser = user || authService.getStoredUser();
    
    // All users go to the same dashboard route now
    navigate('/dashboard');
  };

  const formFields = [
    {
      type: 'email',
      name: 'email',
      label: 'Email Address',
      placeholder: 'Enter your email',
      required: true
    },
    {
      type: 'password',
      name: 'password',
      label: 'Password',
      placeholder: 'Enter your password',
      required: true,
      hint: 'Must include letters, numbers, and symbols'
    },
    {
      type: 'checkbox',
      name: 'remember',
      label: 'Remember me',
      required: false,
      group: 'remember-forgot'
    },
    {
      type: 'link',
      name: 'forgotPassword',
      label: 'Forgot Password?',
      href: '/forgot-password',
      required: false,
      group: 'remember-forgot'
    }
  ];

  const handleSubmit = async (formData) => {
    setError('');
    setIsLoading(true);

    try {
      // Call the backend login API
      const response = await authService.login(formData.email, formData.password);
      
      if (response.token) {
        // Store the token
        authService.storeAuthData(response.token);

        try {
          // Get user data to determine role and redirect appropriately
          const userData = await authService.getUserData();
          authService.storeAuthData(response.token, userData);

          // Show success modal
          modal.showSuccess(
            'Sign in successful!',
            `Welcome back, ${userData.name}. You will be redirected to your dashboard.`
          );

          // Set flag to indicate we're waiting for redirect
          setIsWaitingForRedirect(true);
          
          // Add a delay for automatic redirect if modal is not closed manually
          redirectTimeoutRef.current = setTimeout(() => {
            modal.close();
            setIsWaitingForRedirect(false);
            redirectToAppropriateRoute(userData);
          }, 2500);

        } catch (userDataError) {
          console.error('Error fetching user data:', userDataError);
          // Still redirect even if we can't get user data
          modal.showSuccess(
            'Sign in successful!',
            'You will be redirected to your dashboard.'
          );
          
          setIsWaitingForRedirect(true);
          redirectTimeoutRef.current = setTimeout(() => {
            modal.close();
            setIsWaitingForRedirect(false);
            redirectToAppropriateRoute();
          }, 2500);
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      
      if (error.response) {
        // Server responded with error status
        const { status, data } = error.response;
        
        if (status === 400) {
          setError(data.msg || 'Invalid email or password.');
        } else if (status === 401) {
          setError('Invalid credentials. Please check your email and password.');
        } else if (status === 500) {
          setError('Server error. Please try again later.');
        } else {
          setError(data.msg || 'Login failed. Please try again.');
        }
      } else if (error.request) {
        // Request was made but no response received
        setError('Network error. Please check your connection and try again.');
      } else {
        // Something else happened
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="sign-in-page">
      <div className="sign-in-container">
        <DynamicForm
          title="Welcome Back"
          subtitle="Please log in to continue"
          fields={formFields}
          onSubmit={handleSubmit}
          submitButtonText={isLoading ? "Signing In..." : "Log In"}
          className='card-static'
          error={error}
          disabled={isLoading}
          footer={
            <button 
              type="button" 
              className="google-sign-in-button"
              disabled={isLoading}
            >
              <img src={googleLogo} alt="Google logo" className="google-logo" />
              Log In with Google
            </button>
          }
        />

        {/* Additional elements that are not part of the main form */}
        <div className="mt-4">
          <p className="sign-up-footer">
            No account yet? <a href="/signup" className="sign-in-link">Sign Up</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signin;