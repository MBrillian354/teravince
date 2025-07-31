import React from 'react';

function SigninForm() {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        // Handle successful login (e.g., redirect, show message)
      } else {
        // Handle login error (e.g., show error message)
      }
    } catch (error) {
      // Handle network error
    }
  };

  return (
    <form className="sign-in-form" onSubmit={handleSubmit}>
      <h1 className="sign-in-title">Welcome Back</h1>
      <p className="sign-in-subtitle">Please log in to continue</p>

      <div className="form-group">
        <label className="form-label">Email Address</label>
        <input
          type="email"
          className="form-input"
          placeholder="Enter your email"
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">Password</label>
        <input
          type="password"
          className="form-input"
          placeholder="Enter your password"
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

      <button type="submit" className="sign-in-button">Log In</button>
      <button type="button" className="google-sign-in-button">
          Log In with Google
      </button>
    </form>
  );
}

export default SigninForm;
