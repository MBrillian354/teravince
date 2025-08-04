import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import DynamicForm from '../components/DynamicForm';
import { useModal } from '../hooks/useModal';
import { selectModal } from '../store/modalSlice';
import googleLogo from '../assets/logos/google.png';

function Signin() {
  const [error, setError] = useState('');
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
      navigate('/admin-dashboard');
    }
  }, [modalState.isOpen, isWaitingForRedirect, navigate]);

  // Dummy staff data with split name fields
  const staffData = {
    staff: [
      {
        id: 1,
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@teravince.com",
        password: "1234",
        role: "Admin",
        department: "IT",
        position: "Senior Developer"
      }
    ]
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

    try {
      const user = staffData.staff.find(
        (user) => user.email === formData.email && user.password === formData.password
      );

      if (user) {
        // Show success modal for successful signin
        modal.showSuccess(
          'Sign in successful!',
          `Welcome back, ${user.firstName} ${user.lastName}. You will be redirected to your dashboard.`
        );

        // Set flag to indicate we're waiting for redirect
        setIsWaitingForRedirect(true);
        
        // Add a delay for automatic redirect if modal is not closed manually
        redirectTimeoutRef.current = setTimeout(() => {
          modal.close();
          setIsWaitingForRedirect(false);
          navigate('/admin-dashboard');
        }, 2500);
      } else {
        setError('Invalid email or password.');
      }
    } catch (error) {
      console.error('Mock data error:', error);
      // Show error modal instead of setting error state
      modal.showError(
        'Login Error',
        'Unable to process login. Please check your connection and try again.'
      );
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
          submitButtonText="Log In"
          className='card-static'
          error={error}
          footer={
            <button type="button" className="google-sign-in-button">
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