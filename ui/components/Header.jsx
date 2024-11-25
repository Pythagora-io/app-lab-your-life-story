import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import axios from 'axios';
import { useAuth } from '../AuthContext';

const Header = () => {
  const { isLoggedIn, setIsLoggedIn, userEmail, setUserEmail } = useAuth();
  const navigate = useNavigate();

  console.log('Header rendering, isLoggedIn:', isLoggedIn);

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout', {}, { withCredentials: true });
      console.log('Logout successful, setting isLoggedIn to false');
      setIsLoggedIn(false);
      setUserEmail('');
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          <Button variant="ghost">Home</Button>
        </Link>
        <nav className="flex items-center">
          {isLoggedIn ? (
            <>
              <span className="mr-4">{userEmail}</span>
              <Link to="/my-stories" className="mr-4">
                <Button variant="ghost">My Stories</Button>
              </Link>
              <Link to="/profile" className="mr-4">
                <Button variant="ghost">Profile</Button>
              </Link>
              <Button onClick={handleLogout}>Logout</Button>
            </>
          ) : (
            <>
              <Link to="/login" className="mr-4">
                <Button>Login</Button>
              </Link>
              <Link to="/register">
                <Button>Register</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;