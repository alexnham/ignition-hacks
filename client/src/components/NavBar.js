import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';
import { useLogout } from '../hooks/useLogout';

const NavBar = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { logout } = useLogout();


  const handleLoginClick = () => {
    navigate('/login');
  }

  const handleLogoutClick = () => {
    logout();
    // navigate('/');
  }

  function getLastWord(str) {
    const words = str.trim().split(/\s+/); // Split by one or more spaces
    return words[words.length - 1];        // Return the last word
  }

  return (
    <div>
      {user && (
        <div>
          <h1 className='text-xl absolute top-10 left-10'>Logged In As: Dr. {getLastWord(user.fullName)}</h1>

          <button
            onClick={handleLogoutClick}
            className="absolute top-10 right-10 px-4 py-2 text-white bg-blue-500 rounded-md"
          >
            Log Out
          </button>
        </div>
      )}

      {!user && (
        <div>
          <button
            onClick={handleLoginClick}
            className="absolute top-10 right-10 px-4 py-2 text-white bg-blue-500 rounded-md"
          >
            Log In
          </button>
        </div>
      )}
    </div>
  );
};

export default NavBar;
