import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import DynamicForm from '../components/DynamicForm';
import { openModal } from '../store/modalSlice';
import googleLogo from '../assets/logos/google.png';


function Signup() {
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const formFields = [
    {
      type: 'text',
      name: 'firstName',
      label: 'First Name',
      placeholder: 'Enter your first name',
      required: true,
      group: 'name'
    },
    {
      type: 'text',
      name: 'lastName',
      label: 'Last Name',
      placeholder: 'Enter your last name',
      required: true,
      group: 'name'
    },
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
      required: false
    }
  ];

  const handleSubmit = async (formData) => {
    setError('');

    try {
      const response = await axios.post('/api/auth/signup', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password
      });

      // If we reach here, the request was successful (status 2xx)
      setError('');
      console.log('Signup successful:', formData.firstName);
      // Show success message since email verification is required
      dispatch(openModal({
        type: 'SUCCESS',
        title: 'Registration Successful',
        data: {
          message: 'Registration successful!',
          description: 'Please check your email for verification.'
        }
      }));
      navigate('/');

    } catch (error) {
      console.error('Signup error:', error);

      if (error.response) {
        // Server responded with error status
        const { status, data } = error.response;

        if (status === 400 && data.msg && data.msg.toLowerCase().includes('email already in use')) {
          setError('A user with this email already exists.');
        } else {
          setError(data.msg || data.message || 'Signup failed. Please try again.');
        }
      } else if (error.request) {
        // Request was made but no response received
        setError('Network error. Please check your connection and try again.');
      } else {
        // Something else happened
        setError('An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="sign-up-page">
      <div className="sign-up-container">
        <DynamicForm
          title="Welcome!"
          subtitle="Please sign up to continue"
          fields={formFields}
          onSubmit={handleSubmit}
          submitButtonText="Sign Up"
          error={error}
          className="card-static"
        />

        {/* Additional elements that are not part of the main form */}
        <div className="mt-4">
          <div className="flex justify-between items-center mb-4">
            <span></span>
            <a href="/forgot-password" className="forgot-password">Forgot Password?</a>
          </div>

          <button type="button" className="google-signup-button">
            <img
              src={googleLogo}
              alt="Google logo"
              className="google-logo"
            />
            Sign Up with Google
          </button>

          <p className="sign-up-footer">
            Already have an account? <a href="/signin" className="sign-up-link">Sign In</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
