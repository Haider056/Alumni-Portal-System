import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import AuthLayout from './AuthLayout';
import { Notice } from './ui';

export default function ResetPassword() {
  const [email, setEmail] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [ok, setOk] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleResetPassword = async (e) => {
    if (e) e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/auth/resetPassword', { email, oldPassword, newPassword });
      setOk(true);
      setMessage(response.data.message);
    } catch (error) {
      setOk(false);
      setMessage((error.response && error.response.data && error.response.data.message) || 'Could not reset password.');
    }
  };

  return (
    <AuthLayout
      title="Change password"
      description="Enter your current password and choose a new one."
      footer={<Link to="/" className="link">Back to sign in</Link>}
    >
      <form onSubmit={handleResetPassword} className="space-y-5">
        {message && <Notice tone={ok ? 'success' : 'danger'}>{message}</Notice>}
        <div>
          <label htmlFor="email" className="label">Email</label>
          <input type="email" id="email" className="input" placeholder="name@ist.edu.pk" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="oldPassword" className="label mb-0">Current password</label>
            <button type="button" className="text-sm text-ink-3 hover:text-ink" style={{ margin: 0 }} onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          <input type={showPassword ? 'text' : 'password'} id="oldPassword" className="input" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
        </div>
        <div>
          <label htmlFor="newPassword" className="label">New password</label>
          <input type={showPassword ? 'text' : 'password'} id="newPassword" className="input" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
        </div>
        <button type="submit" className="btn btn-primary btn-lg w-full">Update password</button>
      </form>
    </AuthLayout>
  );
}
