import React from 'react';
import './ForgotPw.css';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getAuth,sendPasswordResetEmail } from 'firebase/auth';

function ForgotPassword() {
  const[email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async(e) =>{
    e.preventDefault();
    const auth = getAuth();
    try{
      await sendPasswordResetEmail(auth,email);
      setMessage('Password reset emial   has been sent to your email!!')
    }
    catch(error){
      setMessage('Failed to sent the email. Please try again !') 
    }
  };

      
  return (
    <div className="forgot-password-container">
      <div className="forgot-password-box">
        <h1 className="forgot-password-title">Forgot Password</h1>
        <p className="forgot-password-text">
          Enter your email and we’ll send you a link to reset your password
        </p>
        <input type="email" placeholder="Please enter the email" className="forgot-password-input" value={email} onChange={(e)=> setEmail(e.target.value)} />
        <button className="forgot-password-submit" onClick={handleSubmit}>SUBMIT</button>
        {message && <p className='forgot-password-message'>{message}</p>}
        <Link to="/login">
        <p className="back-to-login">Back to login</p>
        </Link>
      </div>
    </div>
  );
}

export default ForgotPassword;
