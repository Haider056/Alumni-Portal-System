import React, { useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import AuthLayout from './AuthLayout';
import { Notice } from './ui';
import './Styles/Login.css';

const Input = ({ id, label, type = 'text', placeholder, autoComplete }) => (
  <div>
    <label className="label" htmlFor={id}>{label}</label>
    <input className="input" type={type} id={id} placeholder={placeholder} autoComplete={autoComplete} />
  </div>
);

function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState('student');
  const [status, setStatus] = useState(null); // { tone, text }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{6,}$/;

  const handleSignup = async (e) => {
    if (e) e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const name = document.getElementById('name').value;
    const country = document.getElementById('country').value;
    const cnic = document.getElementById('cnic').value;
    const mobileNumber = document.getElementById('mobile_number').value;
    const city = document.getElementById('city').value;

    if (!emailRegex.test(email)) {
      setStatus({ tone: 'danger', text: 'Invalid email format.' });
      return;
    }
    if (!passwordRegex.test(password)) {
      setStatus({ tone: 'danger', text: 'Password must be 6+ characters with one capital letter and one special character.' });
      return;
    }
    if (password !== confirmPassword) {
      setStatus({ tone: 'danger', text: 'Passwords do not match.' });
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          name,
          country,
          cnic,
          mobile_number: mobileNumber,
          city,
          role: selectedRole,
        }),
      });

      if (response.ok) {
        setStatus({ tone: 'success', text: 'Account created. You can now sign in.' });
      } else {
        const data = await response.json();
        setStatus({ tone: 'danger', text: `Signup failed: ${data.message}` });
      }
    } catch (error) {
      setStatus({ tone: 'danger', text: 'Error during signup. Please try again later.' });
    }
  };

  return (
    <AuthLayout
      wide
      title="Create your account"
      description="Join the IST network to find roles, events and fellow graduates."
      footer={<>Already registered? <Link to="/" className="link">Sign in</Link></>}
    >
      <form onSubmit={handleSignup} className="space-y-5" noValidate>
        {status && <Notice tone={status.tone}>{status.text}</Notice>}

        <div>
          <span className="label">I am joining as</span>
          <div className="segmented w-full grid grid-cols-2">
            {[
              ['student', 'Current student'],
              ['alumni', 'Alumni'],
            ].map(([value, text]) => (
              <button key={value} type="button" aria-pressed={selectedRole === value} onClick={() => setSelectedRole(value)}>
                {text}
              </button>
            ))}
          </div>
          {/* kept for compatibility with any code reading #role */}
          <select id="role" value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)} className="hidden">
            <option value="alumni">Alumni</option>
            <option value="student">Student</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input id="name" label="Full name" placeholder="Ayesha Khan" autoComplete="name" />
          <Input id="email" label="Email" type="email" placeholder="name@ist.edu.pk" autoComplete="email" />
          <Input id="mobile_number" label="Mobile number" placeholder="+92 300 0000000" autoComplete="tel" />
          <Input id="cnic" label="CNIC" placeholder="00000-0000000-0" />
          <Input id="city" label="City" placeholder="Islamabad" autoComplete="address-level2" />
          <Input id="country" label="Country" placeholder="Pakistan" autoComplete="country-name" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label" htmlFor="password">Password</label>
            <div className="relative">
              <input className="input pr-10" type={showPassword ? 'text' : 'password'} id="password" placeholder="Create a password" autoComplete="new-password" />
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
          <div>
            <label className="label" htmlFor="confirmPassword">Confirm password</label>
            <input className="input" type={showPassword ? 'text' : 'password'} id="confirmPassword" placeholder="Repeat password" autoComplete="new-password" />
          </div>
        </div>
        <p className="hint -mt-2">At least 6 characters, including one capital letter and one special character.</p>

        <button className="btn btn-primary btn-lg w-full" type="submit">Create account</button>
      </form>
    </AuthLayout>
  );
}

export default Signup;
