// authContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setLoggedIn] = useState(() => {
    return localStorage.getItem('token') !== null;
  });

  useEffect(() => {
    setLoggedIn(localStorage.getItem('token') !== null);
  }, []); 

  const handleLogin = async (email, password) => {
    try {
      const response = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token); 
        setLoggedIn(true);
        localStorage.setItem('name', data.name);
        localStorage.setItem('email', data.email);
        localStorage.setItem('role', JSON.stringify(data.role));
        alert('Login successful');
        return true;
      } else {
        return false; // Login failed
      }
    } catch (error) {
      console.error('Error during login:', error);
      return false; // Login failed
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:3001/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        localStorage.removeItem('token'); // Remove token from localStorage on logout
        setLoggedIn(false);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Error during logout:', error);
      return false;
    }
  };

  // Heartbeat functionality
  useEffect(() => {
    const heartbeatInterval = setInterval(async () => {
      try {
        const response = await fetch('http://localhost:3001/heartbeat', {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) {
          console.log('Server is unresponsive. Logging out...');
          handleLogout(); 
        }
      } catch (error) {
        console.error('Error sending heartbeat request:', error);
        console.log('Server is unresponsive. Logging out...');
        handleLogout();
      }
    }, 10 * 60 * 1000); // 10 minutes

    return () => clearInterval(heartbeatInterval);
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, handleLogin, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};



