import React, { useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../authContext';
import AuthLayout from './AuthLayout';
import { Notice } from './ui';
import './Styles/Login.css';

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { handleLogin } = useAuth();
  const [emailError, setEmailError] = useState('');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address.');
      return;
    }

    setSubmitting(true);
    try {
      const loginSuccessful = await handleLogin(email, password);
      if (loginSuccessful) {
        navigate('/home');
      } else {
        setFormError('Login failed. Please check your email and password.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setFormError('Error during login. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Sign in"
      description="Welcome back. Use your IST alumni or student account."
      footer={<>New to the portal? <Link to="/Signup" className="link">Create an account</Link></>}
    >
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {formError && <Notice tone="danger">{formError}</Notice>}
        <div>
          <label className="label" htmlFor="email">Email</label>
          <input
            className="input"
            type="email"
            id="email"
            autoComplete="email"
            placeholder="name@ist.edu.pk"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailError('');
            }}
          />
          {emailError && <p className="text-xs text-danger mt-1.5">{emailError}</p>}
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="label mb-0" htmlFor="password">Password</label>
            <a href="/ResetPassword" className="text-sm text-ink-3 hover:text-ink">Reset password</a>
          </div>
          <div className="relative">
            <input
              className="input pr-10"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-1 top-1 h-8 w-8 inline-flex items-center justify-center rounded-ctl text-ink-3 hover:text-ink"
              style={{ margin: 0 }}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
        </div>

        <button className="btn btn-primary btn-lg w-full" type="submit" disabled={submitting}>
          {submitting ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </AuthLayout>
  );
}

export default Login;
