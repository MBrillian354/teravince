import React from 'react';
import SigninForm from '../components/SigninForm';
import '../index.css';

function Signin() {
  return (
    <div className="sign-in-page">
      <div className="sign-in-container">
        <SigninForm />
      </div>
    </div>
  );
}

export default Signin;
