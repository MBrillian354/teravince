import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DynamicForm from '../components/DynamicForm';
import googleLogo from '../assets/logos/google.png';


function Signup() {
  const [error, setError] = useState('');
  const navigate = useNavigate();

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
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setError('');
        console.log('Signup successful:', formData.firstName);
        navigate('/signin');
      } else {
        // Check specific message or status code for duplicate staff error
        if (
          response.status === 409 ||
          (data.message &&
            data.message.toLowerCase().includes('already exists'))
        ) {
          setError('A staff member with this email already exists.');
        } else {
          setError(data.message || 'Signup failed. Please try again.');
        }
      }
    } catch (error) {
      console.error('Network error:', error);
      setError('Network error. Please try again later.');
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
