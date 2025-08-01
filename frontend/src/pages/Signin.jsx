import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DynamicForm from '../components/DynamicForm';
import googleLogo from '../assets/logos/google.png';

function Signin() {
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Dummy staff data
  const staffData = {
    staff: [
      {
        id: 1,
        name: "John Doe",
        email: "john.doe@teravince.com",
        password: "password123!",
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
        alert(`Login successful! Welcome, ${user.name}`);
        navigate('/admin-dashboard');
      } else {
        setError('Invalid email or password.');
      }
    } catch (error) {
      console.error('Mock data error:', error);
      setError('Unable to process login. Please check the data format.');
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
