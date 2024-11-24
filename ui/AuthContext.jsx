
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  console.log('AuthProvider rendering, isLoggedIn:', isLoggedIn);

  const checkAuthStatus = async () => {
    try {
      const response = await axios.get('/api/auth/me', { withCredentials: true });
      console.log('Authentication check successful, setting isLoggedIn to true');
      setIsLoggedIn(true);
      setUserEmail(response.data.email);
    } catch (error) {
      console.log('Authentication check failed, setting isLoggedIn to false');
      console.error('Auth check failed:', error.response?.data?.error || 'An unexpected error occurred', error);
      setIsLoggedIn(false);
      setUserEmail('');
    }
  };

  useEffect(() => {
    console.log('AuthProvider useEffect triggered');
    checkAuthStatus();
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, userEmail, setUserEmail, checkAuthStatus }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
