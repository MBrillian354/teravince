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

  // Error handling helper function
  const handleError = (error, context = 'login') => {
    console.error(`${context} error:`, error);

    const errorMap = {
      400: { title: 'Invalid Credentials', message: 'Invalid email or password.' },
      401: { title: 'Authentication Failed', message: 'Invalid credentials. Please check your email and password.' },
      500: { title: 'Server Error', message: 'Server error. Please try again later.' }
    };

    let errorTitle = 'Login Failed';
    let errorMessage = 'Login failed. Please try again.';

    if (error.response) {
      const { status, data } = error.response;
      const errorInfo = errorMap[status];

      if (errorInfo) {
        errorTitle = errorInfo.title;
        errorMessage = data.msg || errorInfo.message;
      } else {
        errorMessage = data.msg || errorMessage;
      }
    } else if (error.request) {
      errorTitle = 'Network Error';
      errorMessage = 'Please check your connection and try again.';
    } else {
      errorTitle = 'Unexpected Error';
      errorMessage = 'An unexpected error occurred. Please try again.';
    }

    modal.showError(errorTitle, errorMessage);
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
            'Sign In Successful!',
            `Welcome back, ${userData.firstName} ${userData.lastName}. You will be redirected to your dashboard shortly.`,
            {
              onConfirm: () => {
                navigate('/dashboard');
              },
              autoClose: true,
              timeout: 3000
            },
          );

          setTimeout(() => redirectToAppropriateRoute(userData), 3000);

        } catch (userDataError) {
          console.error('Error fetching user data:', userDataError);
          modal.showError(
            'Cannot Sign In',
            'An error occurred while trying to sign in. Please try again.'
          );
          throw userDataError; // Re-throw to let the outer catch handle cleanup
        }
      }
    } catch (error) {
      handleError(error);
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