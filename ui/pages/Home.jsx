import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext';
import './Home.css';

function Home() {
  const { isLoggedIn } = useAuth();
  const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
    const fetchUserEmail = async () => {
      if (isLoggedIn) {
        try {
          const response = await axios.get('/api/auth/me');
          setUserEmail(response.data.email);
        } catch (error) {
          console.error('Error fetching user email:', error);
          setUserEmail(null);
        }
      } else {
        setUserEmail(null);
      }
    };

    fetchUserEmail();
  }, [isLoggedIn]);

  return (
    <div id="homePage" className="flex flex-col items-center justify-center min-h-screen animate__animated animate__fadeIn">
      <h1 className="text-4xl font-bold mb-6">Home Page</h1>
      {isLoggedIn && userEmail ? (
        <p className="text-xl mb-6">Welcome, {userEmail}!</p>
      ) : (
        <p className="text-xl mb-6">Welcome to our website!</p>
      )}
    </div>
  );
}

export default Home;