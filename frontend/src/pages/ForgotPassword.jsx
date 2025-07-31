import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ForgotPassword() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate(); // initialize navigation

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your reset link trigger logic here
    setIsSubmitted(true); // Show success message
  };

  const handleBackToSignin = () => {
    navigate('/'); // Navigate to the sign-in page
  };

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-container">
        {!isSubmitted ? (
          <form className="forgot-password-form" onSubmit={handleSubmit}>
            <h1 className="forgot-password-title">Forgotten your password?</h1>
            <p className="forgot-password-subtitle">
              There is nothing to worry about, we’ll send you a message to help you reset your password.
            </p>
      <hr className="mb-10 border-t border-gray-400" />

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                name="email"
                required
                placeholder="Enter personal or work email address"
                className="form-input"
              />
            </div>

            <button type="submit" className="forgot-password-button">
              Send Reset Link
            </button>
          </form>
        ) : (
          <div className="reset-success-message">
            <h2>Reset Link Sent!</h2>
            <p>Please check your inbox, and remember to look in your spam or junk folder if you don’t see it right away.</p>
            <p>If you’re still having trouble, you can try resending the link or contacting support for assistance.</p>
            <button className="forgot-password-button" onClick={handleBackToSignin}>
              Go Back to Sign In
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;
