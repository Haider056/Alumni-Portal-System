import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import logo from './Assets/logo.png';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../authContext'; 
import './Styles/Login.css';

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { handleLogin } = useAuth();
  const [emailError, setEmailError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address.');
      return;
    }

    try {
      const loginSuccessful = await handleLogin(email, password);
      if (loginSuccessful) {
        
        navigate('/home');
      } else {
        // Handle login failure
        alert('Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('Error during login. Please try again later.');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="Login-Container MontserratFont">
      <div>
        <img className='Login-logo' src={logo} alt="Logo" />
      </div>
      <div className='Login-Form'>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setEmailError('');
          }}
        />
        {emailError && <p className="error-message">{emailError}</p>}

        <label htmlFor="password">Password</label>

        <div className="Login-PasswordInputContainer">
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="Login-PasswordInput"
          />
          <span
            className="Login-TogglePasswordButton"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        <div className="Login-ForgotPassword">
          <a href="/ResetPassword">Reset Password</a>
        </div>
        <button  
          className='bg-blue-500 text-white px-4 py-2 rounded-md'
          type="button"
          onClick={handleSubmit} 
        >
          Login
        </button>

        <div className='Login-footer'>
          <span>Not a member?</span>
          <a href="/Signup">SignUp</a>
        </div>
      </div>
    </div>
  );
}

export default Login;
