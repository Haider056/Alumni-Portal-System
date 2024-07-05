import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import logo from './Assets/logo.png';
import './Styles/Login.css';

function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState('student');

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{6,}$/;

  const handleSignup = async () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const name = document.getElementById('name').value;
    const country = document.getElementById('country').value;
    const cnic = document.getElementById('cnic').value;
    const mobileNumber = document.getElementById('mobile_number').value;
    const city = document.getElementById('city').value;

    if (!emailRegex.test(email)) {
      alert('Invalid email format');
      return;
    }

    if (!passwordRegex.test(password)) {
      alert('Password must be 6+ characters with one capital letter and special character');
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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
        alert('Signup successful');
      } else {
        const data = await response.json();
        alert(`Signup failed: ${data.message}`);
      }
    } catch (error) {
      alert('Error during signup:', error);
    }
  };

  return (
    <div className="Login-Container MontserratFont">
      <div>
        <img className="Login-logo" src={logo} alt="Logo" />
      </div>
      <div className="Login-Form">
        <label htmlFor="email">Email</label>
        <input type="email" id="email" placeholder="Enter your email" />

        <label htmlFor="name">Name</label>
        <input type="text" id="name" placeholder="Enter your Name" />

        <label htmlFor="country">Country</label>
        <input type="text" id="country" placeholder="Enter your Country" />

        <label htmlFor="cnic">CNIC</label>
        <input type="text" id="cnic" placeholder="Enter your CNIC" />

        <label htmlFor="mobileNumber">Mobile Number</label>
        <input
          type="text"
          id="mobile_number"
          placeholder="Enter your Mobile Number"
        />

        <label htmlFor="city">City</label>
        <input type="text" id="city" placeholder="Enter your City" />

        <label htmlFor="password">Password</label>
        <div className="Login-PasswordInputContainer">
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            placeholder="Enter your password"
            className="Login-PasswordInput"
          />
          <span
            className="Login-TogglePasswordButton"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <label htmlFor="confirmPassword">Confirm Password</label>
        <div className="Login-PasswordInputContainer">
          <input
            type={showPassword ? 'text' : 'password'}
            id="confirmPassword"
            placeholder="Confirm your password"
            className="Login-PasswordInput"
          />
        </div>

        <label htmlFor="role">Role</label>
        <select
          id="role"
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '35px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            outline: 'none',
            fontFamily: 'Montserrat',
            fontSize: '16px',
            color: '#333',
          }}
        >
          <option value="alumni">Alumni</option>
          <option value="student">Student</option>
        </select>


        <button className='bg-blue-500 text-white px-4 py-2 rounded-md' type="button" onClick={handleSignup}>
          SignUp
        </button>


        <div className="Login-ForgotPassword">
          <span className="ClickableText">Forgot Password?</span>
        </div>

        <div className="Login-footer">
          <span>Already Registered?</span>
          <a href="/">Login</a>
        </div>
      </div>
    </div>
  );
}

export default Signup;
