// src/components/SignupForm.jsx
import React, { useState } from 'react';
import googleLogo from '../assets/logos/google.png';
import { useNavigate } from 'react-router-dom';

function SignupForm() {
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const firstName = formData.get('firstName');
    const lastName = formData.get('lastName');
    const email = formData.get('email');
    const password = formData.get('password');

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setError('');
        console.log('Signup successful:', firstName);
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
    <form className="sign-up-form" onSubmit={handleSubmit}>
      <h1 className="sign-up-title">Welcome!</h1>
      <p className="sign-up-subtitle">Please sign up to continue</p>

      <hr className="mb-6 border-t border-gray-400" />

      {error && (
        <p className="text-red-500 text-sm mb-4">{error}</p>
      )}

      <div className="form-group flex gap-4">
        <div className="w-1/2">
          <label className="form-label">First Name</label>
          <input
            type="text"
            className="form-input"
            placeholder="Enter your first name"
            name="firstName"
            required
          />
        </div>

        <div className="w-1/2">
          <label className="form-label">Last Name</label>
          <input
            type="text"
            className="form-input"
            placeholder="Enter your last name"
            name="lastName"
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Email Address</label>
        <input
          type="email"
          className="form-input"
          placeholder="Enter your email"
          name="email"
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">Password</label>
        <input
          type="password"
          className="form-input"
          placeholder="Enter your password"
          name="password"
          required
        />
        <p className="form-hint">Must include letters, numbers, and symbols</p>
      </div>

      <div className="form-options">
        <label className="remember-me">
          <input type="checkbox" />
          Remember me
        </label>
        <a href="/forgot-password" className="forgot-password">Forgot Password?</a>
      </div>

      <button type="submit" className="signup-button">Sign Up</button>

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
    </form>
  );
}

export default SignupForm;
