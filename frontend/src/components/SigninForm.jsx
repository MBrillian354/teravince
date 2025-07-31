import React, { useState } from 'react';
import googleLogo from '../assets/logos/google.png';
import { useNavigate } from 'react-router-dom';

function SigninForm() {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');

    try {
      const user = staffData.staff.find(
        (user) => user.email === email && user.password === password
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
    <form className="sign-in-form" onSubmit={handleSubmit}>
      <h1 className="sign-in-title">Welcome Back</h1>
      <p className="sign-in-subtitle">Please log in to continue</p>

      <hr className="mb-6 border-t border-gray-400" />

      {error && <p className="text-red-500 mb-4">{error}</p>}

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
        <a href="/forgot-password" className="forgot-password">
          Forgot Password?
        </a>
      </div>

      <button type="submit" className="sign-in-button">Log In</button>

      <button type="button" className="google-sign-in-button">
        <img src={googleLogo} alt="Google logo" className="google-logo" />
        Log In with Google
      </button>

      <p className="sign-up-footer">
        No account yet? <a href="/signup" className="sign-in-link">Sign Up</a>
      </p>
    </form>
  );
}

export default SigninForm;
