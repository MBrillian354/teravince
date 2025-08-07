import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DynamicForm from '../../components/ui/DynamicForm';

function ForgotPassword() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  const formFields = [
    {
      type: 'email',
      name: 'email',
      label: 'Email Address',
      placeholder: 'Enter personal or work email address',
      required: true
    }
  ];

  const handleSubmit = (formData) => {
    // Add your reset link trigger logic here
    console.log('Reset password for:', formData.email);
    setIsSubmitted(true); // Show success message
  };

  const handleBackToSignin = () => {
    navigate('/'); // Navigate to the sign-in page
  };

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-container">
        {!isSubmitted ? (
          <DynamicForm
            title="Forgotten your password?"
            subtitle="There is nothing to worry about, we'll send you a message to help you reset your password."
            fields={formFields}
            onSubmit={handleSubmit}
            submitButtonText="Send Reset Link"
            className="forgot-password-form"
          />
        ) : (
          <div className="reset-success-message">
            <h2>Reset Link Sent!</h2>
            <p>Please check your inbox, and remember to look in your spam or junk folder if you don't see it right away.</p>
            <p>If you're still having trouble, you can try resending the link or contacting support for assistance.</p>
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
