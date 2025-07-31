import React from 'react';
import SigninForm from '../components/SigninForm'; 
import '../index.css';

function Signin() {
  return (
    <div className="sign-in-page">
      <div className="sign-in-container">
        <SigninForm /> {/* ✅ lowercase 'i' */}
        <div className="sign-in-footer">
          <p>No account yet? <a href="/signup" className="sign-in-link">Sign Up</a></p>
        </div>
      </div>
    </div>
  );
}

export default Signin;
