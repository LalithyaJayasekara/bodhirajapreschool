import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../../firebase/firebase'; 
import './Login.css'; 
import { Icon } from 'react-icons-kit';
import { eyeOff } from 'react-icons-kit/feather/eyeOff';
import { eye } from 'react-icons-kit/feather/eye';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password.');
      setLoading(false);
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const teacherQuery = query(collection(db, 'teachers'), where('email', '==', email));
      const teacherSnapshot = await getDocs(teacherQuery);

      if (!teacherSnapshot.empty) {
        const teacherData = teacherSnapshot.docs[0].data();

        if (teacherData.isFirstTimeLogin) {
          navigate('/resetpw'); 
          return;
        }

        navigate('/teacher', { state: { user: teacherData } }); 
        return;
      }

      const studentQuery = query(collection(db, 'students'), where('email', '==', email));
      const studentSnapshot = await getDocs(studentQuery);

      if (!studentSnapshot.empty) {
        const studentData = studentSnapshot.docs[0].data();

        if (studentData.isFirstTimeLogin) {
          navigate('/resetpw'); 
          return;
        }

        navigate('/student', { state: { user: studentData } }); 
        return;
      }

      // New condition for users not found in either teachers or students
      window.location.href = 'http://localhost:3001/dashboard'; 

      setError('Username is incorrect.');
    } catch (error) {
      // Create a mapping for error codes to user-friendly messages
      const errorMessages = {
        'auth/wrong-password': 'The password you entered is incorrect.',
        'auth/user-not-found': 'No account found with that email address.',
        'auth/invalid-email': 'Please enter a valid email address.',
        // Add any other error codes you want to handle here
      };

      setError(errorMessages[error.code] || 'Login failed. Please try again.');
    } finally {
      setLoading(false); 
    }
  };

  const handleTogglePassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">Login</h1>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              className="login-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                placeholder="Enter your password"
                className="login-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span className="password-toggle" onClick={handleTogglePassword} aria-label="Toggle password visibility">
                <Icon icon={showPassword ? eye : eyeOff} size={20} />
              </span>
            </div>
          </div>
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        {error && <p className="error-message">{error}</p>}
        <Link to="/forgotpw">
          <p className="forgot-password">Forgot Password?</p>
        </Link>
      </div>
    </div>
  );
};

export default Login;
